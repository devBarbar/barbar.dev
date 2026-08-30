import { ArrowUpRight, Clock3, Youtube } from "lucide-react";
import Link from "next/link";

import type { BlogPostSummary } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { getLocalizedPath, type Locale } from "@/lib/locales";

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function BlogCard({
  post,
  locale,
  headingLevel = 3,
}: {
  post: BlogPostSummary;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const { blog } = getDictionary(locale);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group glass flex h-full flex-col rounded-2xl border-slate-800 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-950/30">
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
          {post.readingMinutes} {blog.minutes}
        </span>
        {post.youtubeVideoId && (
          <span className="inline-flex items-center gap-1.5 text-red-400">
            <Youtube aria-hidden="true" className="h-3.5 w-3.5" />
            {blog.videoLabel}
          </span>
        )}
      </div>

      <Heading className="mb-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-blue-300">
        <Link href={getLocalizedPath(locale, `/blog/${post.slug}`)}>{post.title}</Link>
      </Heading>
      <p className="mb-6 flex-grow leading-relaxed text-slate-400">{post.description}</p>

      {post.tags.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label={blog.tagsLabel}>
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={getLocalizedPath(locale, `/blog/${post.slug}`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
      >
        {blog.readMore}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </article>
  );
}
