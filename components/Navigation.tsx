"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube } from "lucide-react";

import { getDictionary } from "@/lib/i18n";
import { locales, type Locale } from "@/lib/locales";
import { youtubeChannel } from "@/lib/youtube";

function localePath(
  pathname: string,
  locale: Locale,
  translatedPostPaths: Record<string, string>,
) {
  const segments = pathname.split("/");

  if (locales.some((supportedLocale) => supportedLocale === segments[1])) {
    if (segments[1] === locale) return pathname;

    if (segments[2] === "blog" && segments[3]) {
      const translatedSlug = translatedPostPaths[segments[3]];

      if (translatedSlug) {
        return `/${locale}/blog/${translatedSlug}`;
      }

      return `/${locale}/blog`;
    }

    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return `/${locale}`;
}

export default function Navigation({
  locale,
  translatedPostPaths,
}: {
  locale: Locale;
  translatedPostPaths: Record<string, string>;
}) {
  const pathname = usePathname();
  const { nav } = getDictionary(locale);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-lg font-black tracking-tight text-white transition-colors hover:text-blue-400"
          aria-label={nav.home}
        >
          barbar<span className="text-blue-400">.dev</span>
        </Link>

        <nav aria-label={nav.primaryLabel} className="flex items-center gap-1 sm:gap-2">
          <Link
            href={`/${locale}`}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            {nav.home}
          </Link>
          <Link
            href={`/${locale}/#about`}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            {nav.about}
          </Link>
          <Link
            href={`/${locale}/#projects`}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            {nav.projects}
          </Link>
          <Link
            href={`/${locale}/blog`}
            aria-current={pathname.startsWith(`/${locale}/blog`) ? "page" : undefined}
            className="rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white aria-[current=page]:bg-blue-500/10 aria-[current=page]:text-blue-300"
          >
            {nav.blog}
          </Link>
          <a
            href={youtubeChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nav.youtube}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Youtube aria-hidden="true" className="h-5 w-5" />
          </a>

          <span className="mx-1 h-5 w-px bg-slate-700" aria-hidden="true" />

          <div className="flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5" aria-label={nav.switchLanguage}>
            {locales.map((supportedLocale) => (
              <Link
                key={supportedLocale}
                href={localePath(pathname, supportedLocale, translatedPostPaths)}
                hrefLang={supportedLocale}
                aria-label={`${nav.switchLanguage}: ${supportedLocale === "en" ? "English" : "Deutsch"}`}
                aria-current={locale === supportedLocale ? "true" : undefined}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-white aria-[current=true]:bg-blue-600 aria-[current=true]:text-white"
              >
                {supportedLocale}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
