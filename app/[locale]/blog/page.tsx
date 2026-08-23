import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadata } = getDictionary(locale);

  return {
    title: metadata.blogTitle,
    description: metadata.blogDescription,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: "/en/blog",
        de: "/de/blog",
        "x-default": "/en/blog",
      },
    },
    openGraph: {
      title: metadata.blogTitle,
      description: metadata.blogDescription,
      url: `/${locale}/blog`,
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: "/og.png",
          width: 1731,
          height: 909,
          alt: metadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      title: metadata.blogTitle,
      description: metadata.blogDescription,
      images: ["/og.png"],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const posts = getAllPosts(locale);
  const { blog } = getDictionary(locale);

  return (
    <>
      <main id="main-content" className="min-h-screen px-4 pb-24 pt-36 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-14 max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">{blog.eyebrow}</p>
            <h1 className="mb-5 text-5xl font-black tracking-tight text-white md:text-7xl">{blog.title}</h1>
            <p className="text-lg leading-relaxed text-slate-400 md:text-xl">{blog.introduction}</p>
          </header>

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="glass rounded-2xl p-8 text-slate-400">{blog.noPosts}</p>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
