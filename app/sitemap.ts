import type { MetadataRoute } from "next";

import { getAllPosts, getPostTranslation } from "@/lib/blog";
import { locales } from "@/lib/locales";

const siteUrl = "https://barbar.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          de: `${siteUrl}/de`,
        },
      },
    },
    {
      url: `${siteUrl}/${locale}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en/blog`,
          de: `${siteUrl}/de/blog`,
        },
      },
    },
  ]);

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => {
      const otherLocale = locale === "en" ? "de" : "en";
      const translation = getPostTranslation(post, otherLocale);
      const languages: Record<string, string> = {
        [locale]: `${siteUrl}/${locale}/blog/${post.slug}`,
      };

      if (translation) {
        languages[otherLocale] = `${siteUrl}/${otherLocale}/blog/${translation.slug}`;
      }

      return {
        url: `${siteUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(`${post.date}T00:00:00.000Z`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages },
      };
    }),
  );

  return [...staticRoutes, ...postRoutes];
}
