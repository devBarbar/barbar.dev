import type { Metadata } from "next";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import VideoEmbed from "@/components/VideoEmbed";
import { getAllPosts, getPost, getPostTranslation } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getFeedPath, getPostImage, getPostJsonLd, siteConfig } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];

  return getAllPosts(params.locale).map((post) => ({ slug: post.slug }));
}

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return {};

  const post = getPost(locale, slug);

  if (!post) return {};

  const otherLocale = locales.find((candidate) => candidate !== locale);
  const translatedPost = otherLocale ? getPostTranslation(post, otherLocale) : undefined;
  const languages: Record<string, string> = {
    [locale]: `/${locale}/blog/${slug}`,
  };

  if (translatedPost && otherLocale) {
    languages[otherLocale] = `/${otherLocale}/blog/${translatedPost.slug}`;
  }

  if (locale === "en") {
    languages["x-default"] = `/en/blog/${slug}`;
  } else if (otherLocale === "en" && translatedPost) {
    languages["x-default"] = `/en/blog/${translatedPost.slug}`;
  }

  const postImage = getPostImage(post);

  return {
    title: post.title,
    description: post.description,
    authors: [
      {
        name: siteConfig.authorName,
        url: `/${locale}#about`,
      },
    ],
    creator: siteConfig.authorName,
    publisher: siteConfig.authorName,
    category: post.tags[0],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
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
      url: `/${locale}/blog/${slug}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_DE",
      publishedTime: `${post.date}T00:00:00.000Z`,
      modifiedTime: `${post.updated ?? post.date}T00:00:00.000Z`,
      authors: [`/${locale}#about`],
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();

  const post = getPost(locale, slug);

  if (!post) notFound();

  const { blog, nav, youtube } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";
  const translation = getPostTranslation(post, otherLocale);
  const jsonLd = getPostJsonLd({
    post,
    homeLabel: nav.home,
    blogLabel: nav.blog,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content" className="min-h-screen px-4 pb-24 pt-28 md:px-6">
        <article className="container mx-auto max-w-3xl">
          <nav aria-label={blog.breadcrumbsLabel} className="mb-12">
            <ol className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href={`/${locale}`} className="transition-colors hover:text-blue-300">
                  {nav.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/${locale}/blog`} className="transition-colors hover:text-blue-300">
                  {nav.blog}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate text-slate-300">
                {post.title}
              </li>
            </ol>
          </nav>

          <header className="mb-12 border-b border-slate-800 pb-10">
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <span>
                {blog.by}{" "}
                <Link rel="author" href={`/${locale}/#about`} className="font-medium text-blue-300 hover:text-blue-200">
                  {siteConfig.authorName}
                </Link>
              </span>
              <span>
                {blog.published} <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              </span>
              {post.updated && post.updated !== post.date && (
                <span>
                  {blog.updated} <time dateTime={post.updated}>{formatDate(post.updated, locale)}</time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" className="h-4 w-4" />
                {post.readingMinutes} {blog.minutes}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">{post.title}</h1>
            <p className="text-xl leading-relaxed text-slate-400">{post.description}</p>
            {post.tags.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label={blog.tagsLabel}>
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {translation && (
              <Link
                href={`/${otherLocale}/blog/${translation.slug}`}
                hrefLang={otherLocale}
                className="mt-7 inline-flex text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                {blog.readTranslation}
              </Link>
            )}
          </header>

          {post.featuredImage && post.featuredImageAlt && (
            <div className="mb-14 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                width={1200}
                height={630}
                sizes="(max-width: 768px) 100vw, 768px"
                className="aspect-[1200/630] h-auto w-full object-cover"
                priority
              />
            </div>
          )}

          {post.youtubeVideoId && (
            <VideoEmbed
              videoId={post.youtubeVideoId}
              videoUrl={`https://www.youtube.com/watch?v=${post.youtubeVideoId}`}
              title={post.title}
              watchLabel={youtube.watchVideo}
              className="mb-14"
            />
          )}

          <div className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml
              components={{
                h1: ({ children }) => <h2>{children}</h2>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer locale={locale} />
    </>
  );
}
