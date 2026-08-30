import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { BlogPostSummary } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { getLocalizedPath, type Locale } from "@/lib/locales";
import BlogCard from "@/components/BlogCard";

export default function BlogPreview({
  posts,
  locale,
}: {
  posts: BlogPostSummary[];
  locale: Locale;
}) {
  const { blog } = getDictionary(locale);

  return (
    <section id="blog" className="container mx-auto max-w-6xl px-4 py-24 md:px-6">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">{blog.eyebrow}</p>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">{blog.latest}</h2>
          <div className="mb-6 h-1 w-20 rounded-full bg-blue-500" />
          <p className="max-w-2xl text-lg text-slate-400">{blog.latestIntroduction}</p>
        </div>
        <Link
          href={getLocalizedPath(locale, "/blog")}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
        >
          {blog.viewAll}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="glass rounded-2xl p-8 text-slate-400">{blog.noPosts}</p>
      )}
    </section>
  );
}
