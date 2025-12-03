import { z } from "zod";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Zod schema for blog post frontmatter validation.
 */
export const BlogPostFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publishedAt: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(val);
    },
    "publishedAt must be a valid ISO date (YYYY-MM-DD)"
  ),
  summary: z.string().min(1, "Summary is required"),
  tags: z.array(z.string()).optional().default([]),
  slug: z.string().optional(),
});

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>;

/**
 * Blog post metadata and content.
 */
export interface BlogPost {
  /** URL-friendly identifier (from frontmatter or filename) */
  slug: string;
  /** Post title */
  title: string;
  /** Publication date as Date object */
  publishedAt: Date;
  /** Brief description/excerpt */
  summary: string;
  /** Category tags (defaults to empty array) */
  tags: string[];
  /** Estimated reading time in minutes */
  readingTime: number;
}

/**
 * Calculate reading time based on word count (~200 words per minute)
 */
function calculateReadingTime(content: string): number {
  // Strip MDX/JSX tags and frontmatter
  const strippedContent = content
    .replace(/---[\s\S]*?---/g, "") // Remove frontmatter
    .replace(/<[^>]*>/g, "") // Remove HTML/JSX tags
    .replace(/`[^`]*`/g, ""); // Remove inline code

  const wordCount = strippedContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Get blog directory path
 */
function getBlogDir(): string {
  return path.join(process.cwd(), "content", "blog");
}

/**
 * Get all MDX files from content/blog/
 */
function getMDXFiles(): string[] {
  const blogDir = getBlogDir();

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

/**
 * Parse a single MDX file and extract metadata
 */
function parseMDXFile(filename: string): BlogPost | null {
  try {
    const blogDir = getBlogDir();
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parse frontmatter using gray-matter
    const { data, content } = matter(fileContent);

    // Validate frontmatter with Zod
    const validated = BlogPostFrontmatterSchema.parse(data);

    // Derive slug: use frontmatter slug if present, otherwise use filename without extension
    const slug = validated.slug || filename.replace(/\.mdx$/, "");

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      title: validated.title,
      publishedAt: new Date(validated.publishedAt),
      summary: validated.summary,
      tags: validated.tags || [],
      readingTime,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      console.error(`Validation error in ${filename}: ${errorMessages}`);
    } else {
      console.error(`Error parsing ${filename}:`, error);
    }
    return null;
  }
}

/**
 * Get all blog posts sorted by publishedAt descending.
 * Secondary sort by title ascending if dates match.
 * @returns Array of BlogPost metadata (empty array if no posts)
 */
export function getAllPosts(): BlogPost[] {
  const mdxFiles = getMDXFiles();
  const posts: BlogPost[] = [];

  for (const filename of mdxFiles) {
    const post = parseMDXFile(filename);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by publishedAt descending, then by title ascending
  posts.sort((a, b) => {
    const dateDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });

  return posts;
}

/**
 * Get a single blog post by slug.
 * @param slug - The post slug to find
 * @returns BlogPost or undefined if not found
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * Get all blog post slugs (for generateStaticParams).
 * @returns Array of all post slugs
 */
export function getAllSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map((post) => post.slug);
}
