import { getAllPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/locales";
import { absoluteUrl, getFeedPath, siteConfig } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822Date(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const posts = getAllPosts(locale);
  const { metadata } = getDictionary(locale);
  const blogUrl = absoluteUrl(`/${locale}/blog`);
  const feedUrl = absoluteUrl(getFeedPath(locale));
  const lastModified = posts
    .map((post) => post.updated ?? post.date)
    .sort((a, b) => b.localeCompare(a))[0];
  const items = posts
    .map((post) => {
      const postUrl = absoluteUrl(`/${locale}/blog/${post.slug}`);
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(postUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
        `<description>${escapeXml(post.description)}</description>`,
        `<pubDate>${toRfc822Date(post.date)}</pubDate>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");
  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${metadata.blogTitle} | ${siteConfig.authorName}`)}</title>`,
    `<link>${escapeXml(blogUrl)}</link>`,
    `<description>${escapeXml(metadata.blogDescription)}</description>`,
    `<language>${locale}</language>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    lastModified ? `<lastBuildDate>${toRfc822Date(lastModified)}</lastBuildDate>` : "",
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
