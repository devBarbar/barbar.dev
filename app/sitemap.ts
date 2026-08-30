import type { MetadataRoute } from "next";

import { getAllPosts, getPostTranslation } from "@/lib/blog";
import { defaultLocale, getLocalizedPath, locales } from "@/lib/locales";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = {
    en: absoluteUrl(getLocalizedPath("en")),
    de: absoluteUrl(getLocalizedPath("de")),
    "x-default": absoluteUrl(getLocalizedPath(defaultLocale)),
  };
  const blogLanguages = {
    en: absoluteUrl(getLocalizedPath("en", "/blog")),
    de: absoluteUrl(getLocalizedPath("de", "/blog")),
    "x-default": absoluteUrl(getLocalizedPath(defaultLocale, "/blog")),
  };
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const latestPostDate = getAllPosts(locale)
      .map((post) => post.updated ?? post.date)
      .sort((a, b) => b.localeCompare(a))[0];

    return [
      {
        url: absoluteUrl(getLocalizedPath(locale)),
        alternates: { languages: homeLanguages },
      },
      {
        url: absoluteUrl(getLocalizedPath(locale, "/blog")),
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
        [locale]: absoluteUrl(
          getLocalizedPath(locale, `/blog/${post.slug}`),
        ),
      };

      if (translation) {
        languages[otherLocale] = absoluteUrl(
          getLocalizedPath(otherLocale, `/blog/${translation.slug}`),
        );
      }

      if (locale === defaultLocale) {
        languages["x-default"] = absoluteUrl(
          getLocalizedPath(defaultLocale, `/blog/${post.slug}`),
        );
      } else if (translation && otherLocale === defaultLocale) {
        languages["x-default"] = absoluteUrl(
          getLocalizedPath(defaultLocale, `/blog/${translation.slug}`),
        );
      }

      return {
        url: absoluteUrl(getLocalizedPath(locale, `/blog/${post.slug}`)),
        lastModified: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
        alternates: { languages },
      };
    }),
  );

  return [...staticRoutes, ...postRoutes];
}
