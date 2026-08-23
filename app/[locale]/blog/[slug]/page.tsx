import type { Metadata } from "next";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Footer from "@/components/Footer";
import VideoEmbed from "@/components/VideoEmbed";
import { getAllPosts, getPost, getPostTranslation } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, type Locale } from "@/lib/locales";

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

  const videoThumbnail = post.youtubeVideoId
    ? `https://i.ytimg.com/vi/${post.youtubeVideoId}/maxresdefault.jpg`
    : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/${locale}/blog/${slug}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      publishedTime: `${post.date}T00:00:00.000Z`,
      tags: post.tags,
      images: videoThumbnail
        ? [{ url: videoThumbnail, alt: post.title }]
        : [],
    },
    twitter: {
      title: post.title,
      description: post.description,
      images: videoThumbnail ? [videoThumbnail] : [],
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

  const { blog, youtube } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";
  const translation = getPostTranslation(post, otherLocale);

  return (
    <>
      <main id="main-content" className="min-h-screen px-4 pb-24 pt-28 md:px-6">
        <article className="container mx-auto max-w-3xl">
          <Link
            href={`/${locale}/blog`}
            className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {blog.backToBlog}
          </Link>

          <header className="mb-12 border-b border-slate-800 pb-10">
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>
                {blog.published} <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              </span>
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
