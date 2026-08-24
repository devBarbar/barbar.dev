import type { MetadataRoute } from "next";

import { getAllPosts, getPostTranslation } from "@/lib/blog";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPostDate = locales
    .flatMap((locale) => getAllPosts(locale))
    .map((post) => post.updated ?? post.date)
    .sort((a, b) => b.localeCompare(a))[0];
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const homeLanguages = {
      en: `${siteConfig.url}/en`,
      de: `${siteConfig.url}/de`,
      "x-default": `${siteConfig.url}/en`,
    };
    const blogLanguages = {
      en: `${siteConfig.url}/en/blog`,
      de: `${siteConfig.url}/de/blog`,
      "x-default": `${siteConfig.url}/en/blog`,
    };

    return [
      {
        url: `${siteConfig.url}/${locale}`,
        alternates: { languages: homeLanguages },
      },
      {
        url: `${siteConfig.url}/${locale}/blog`,
        ...(latestPostDate
          ? { lastModified: new Date(`${latestPostDate}T00:00:00.000Z`) }
          : {}),
        alternates: { languages: blogLanguages },
      },
    ];
  });

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => {
      const otherLocale = locale === "en" ? "de" : "en";
      const translation = getPostTranslation(post, otherLocale);
      const languages: Record<string, string> = {
        [locale]: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      };

      if (translation) {
        languages[otherLocale] = `${siteConfig.url}/${otherLocale}/blog/${translation.slug}`;
      }

      if (locale === "en") {
        languages["x-default"] = `${siteConfig.url}/en/blog/${post.slug}`;
      } else if (translation && otherLocale === "en") {
        languages["x-default"] = `${siteConfig.url}/en/blog/${translation.slug}`;
      }

      return {
        url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
        alternates: { languages },
      };
    }),
  );

  return [...staticRoutes, ...postRoutes];
}
