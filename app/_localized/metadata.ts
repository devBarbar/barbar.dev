import type { Metadata } from "next";

import { getPost, getPostTranslation } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  type Locale,
} from "@/lib/locales";
import { getFeedPath, getPostImage, siteConfig } from "@/lib/seo";

const homeLanguages = {
  en: getLocalizedPath("en"),
  de: getLocalizedPath("de"),
  "x-default": getLocalizedPath(defaultLocale),
};

const blogLanguages = {
  en: getLocalizedPath("en", "/blog"),
  de: getLocalizedPath("de", "/blog"),
  "x-default": getLocalizedPath(defaultLocale, "/blog"),
};

function openGraphLocale(locale: Locale) {
  return locale === "de" ? "de_DE" : "en_US";
}

export function getSiteMetadata(locale: Locale): Metadata {
  const { metadata } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";
  const homePath = getLocalizedPath(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: metadata.title,
      template: `%s | ${siteConfig.authorName}`,
    },
    description: metadata.description,
    authors: [
      {
        name: siteConfig.authorName,
        url: `${homePath}#about`,
      },
    ],
    creator: siteConfig.authorName,
    publisher: siteConfig.authorName,
    alternates: {
      canonical: homePath,
      languages: homeLanguages,
      types: {
        "application/rss+xml": getFeedPath(locale),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: metadata.title,
      description: metadata.description,
      url: homePath,
      locale: openGraphLocale(locale),
      alternateLocale: openGraphLocale(otherLocale),
      images: [
        {
          ...siteConfig.defaultImage,
          alt: metadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [siteConfig.defaultImage.url],
    },
  };
}

export function getBlogMetadata(locale: Locale): Metadata {
  const { metadata } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";
  const blogPath = getLocalizedPath(locale, "/blog");

  return {
    title: metadata.blogTitle,
    description: metadata.blogDescription,
    alternates: {
      canonical: blogPath,
      languages: blogLanguages,
      types: {
        "application/rss+xml": getFeedPath(locale),
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: metadata.blogTitle,
      description: metadata.blogDescription,
      url: blogPath,
      locale: openGraphLocale(locale),
      alternateLocale: openGraphLocale(otherLocale),
      images: [
        {
          ...siteConfig.defaultImage,
          alt: metadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.blogTitle,
      description: metadata.blogDescription,
      images: [siteConfig.defaultImage.url],
    },
  };
}

export function getBlogPostMetadata(locale: Locale, slug: string): Metadata {
  const post = getPost(locale, slug);

  if (!post) return {};

  const otherLocale = locales.find((candidate) => candidate !== locale);
  const translatedPost = otherLocale
    ? getPostTranslation(post, otherLocale)
    : undefined;
  const postPath = getLocalizedPath(locale, `/blog/${slug}`);
  const languages: Record<string, string> = {
    [locale]: postPath,
  };

  if (translatedPost && otherLocale) {
    languages[otherLocale] = getLocalizedPath(
      otherLocale,
      `/blog/${translatedPost.slug}`,
    );
  }

  if (locale === defaultLocale) {
    languages["x-default"] = postPath;
  } else if (otherLocale === defaultLocale && translatedPost) {
    languages["x-default"] = getLocalizedPath(
      defaultLocale,
      `/blog/${translatedPost.slug}`,
    );
  }

  const postImage = getPostImage(post);
  const authorPath = `${getLocalizedPath(locale)}#about`;

  return {
    title: post.title,
    description: post.description,
    authors: [
      {
        name: siteConfig.authorName,
        url: authorPath,
      },
    ],
    creator: siteConfig.authorName,
    publisher: siteConfig.authorName,
    category: post.tags[0],
    alternates: {
      canonical: postPath,
      languages,
      types: {
        "application/rss+xml": getFeedPath(locale),
      },
    },
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      url: postPath,
      locale: openGraphLocale(locale),
      ...(translatedPost && otherLocale
        ? { alternateLocale: openGraphLocale(otherLocale) }
        : {}),
      publishedTime: `${post.date}T00:00:00.000Z`,
      modifiedTime: `${post.updated ?? post.date}T00:00:00.000Z`,
      authors: [authorPath],
      section: post.tags[0],
      tags: post.tags,
      images: postImage ? [{ url: postImage.url, alt: postImage.alt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: postImage ? [{ url: postImage.url, alt: postImage.alt }] : [],
    },
  };
}
