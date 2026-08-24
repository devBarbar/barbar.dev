import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

import { locales, type Locale } from "@/lib/locales";

const blogDirectory = path.join(process.cwd(), "content", "blog");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((value) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  )
  .refine(
    (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const parsedDate = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === value;
    },
    "date must use YYYY-MM-DD",
  );

const featuredImagePattern = /^\/(?!\/).+\.(?:avif|gif|jpe?g|png|webp)$/i;

const frontmatterSchema = z
  .strictObject({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(220),
    date: dateSchema,
    updated: dateSchema.optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
    published: z.boolean(),
    translationKey: z.string().regex(slugPattern).optional(),
    featuredImage: z.string().trim().regex(featuredImagePattern).optional(),
    featuredImageAlt: z.string().trim().min(1).max(180).optional(),
    youtubeVideoId: z.string().regex(videoIdPattern).optional(),
    youtubeVideoUploadDate: dateSchema.optional(),
  })
  .superRefine((data, context) => {
    if (data.updated && data.updated < data.date) {
      context.addIssue({
        code: "custom",
        path: ["updated"],
        message: "updated must be on or after date",
      });
    }

    if (Boolean(data.featuredImage) !== Boolean(data.featuredImageAlt)) {
      context.addIssue({
        code: "custom",
        path: data.featuredImage ? ["featuredImageAlt"] : ["featuredImage"],
        message: "featuredImage and featuredImageAlt must be provided together",
      });
    }

    if (data.youtubeVideoUploadDate && !data.youtubeVideoId) {
      context.addIssue({
        code: "custom",
        path: ["youtubeVideoUploadDate"],
        message: "youtubeVideoUploadDate requires youtubeVideoId",
      });
    }
  });

export type BlogPostSummary = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  readingMinutes: number;
  translationKey: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  youtubeVideoId?: string;
  youtubeVideoUploadDate?: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

function getMarkdownFiles(locale: Locale) {
  const localeDirectory = path.join(blogDirectory, locale);

  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  return fs
    .readdirSync(localeDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function readPost(locale: Locale, fileName: string): BlogPost | null {
  const slug = path.basename(fileName, ".md");

  if (!slugPattern.test(slug)) {
    throw new Error(
      `Invalid blog filename "${fileName}". Use lowercase letters, numbers, and hyphens only.`,
    );
  }

  const filePath = path.join(blogDirectory, locale, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "front matter"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid front matter in ${filePath}: ${details}`);
  }

  if (!parsed.data.published) {
    return null;
  }

  if (!content.trim()) {
    throw new Error(`Blog post ${filePath} has no Markdown content.`);
  }

  const wordCount = content.trim().split(/\s+/u).filter(Boolean).length;

  return {
    slug,
    locale,
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    updated: parsed.data.updated,
    tags: parsed.data.tags,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    translationKey: parsed.data.translationKey ?? slug,
    featuredImage: parsed.data.featuredImage,
    featuredImageAlt: parsed.data.featuredImageAlt,
    youtubeVideoId: parsed.data.youtubeVideoId,
    youtubeVideoUploadDate: parsed.data.youtubeVideoUploadDate,
    content,
  };
}

const readPostsForLocale = cache((locale: Locale): BlogPost[] => {
  const posts = getMarkdownFiles(locale)
    .map((fileName) => readPost(locale, fileName))
    .filter((post): post is BlogPost => post !== null);
  const translationKeys = new Set<string>();

  for (const post of posts) {
    if (translationKeys.has(post.translationKey)) {
      throw new Error(
        `Duplicate translationKey "${post.translationKey}" in ${locale} blog posts.`,
      );
    }

    translationKeys.add(post.translationKey);
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
});

export function getAllPosts(locale: Locale): BlogPostSummary[] {
  return readPostsForLocale(locale).map((post) => ({
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    description: post.description,
    date: post.date,
    updated: post.updated,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
    translationKey: post.translationKey,
    featuredImage: post.featuredImage,
    featuredImageAlt: post.featuredImageAlt,
    youtubeVideoId: post.youtubeVideoId,
    youtubeVideoUploadDate: post.youtubeVideoUploadDate,
  }));
}

export function getPost(locale: Locale, slug: string): BlogPost | undefined {
  if (!slugPattern.test(slug)) {
    return undefined;
  }

  return readPostsForLocale(locale).find((post) => post.slug === slug);
}

export function getPostTranslation(post: BlogPostSummary, locale: Locale) {
  return readPostsForLocale(locale).find(
    (candidate) => candidate.translationKey === post.translationKey,
  );
}

export function getAllPostParams() {
  return locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}
