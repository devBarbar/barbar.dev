"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube } from "lucide-react";

import { getLocalizedPath, locales, type Locale } from "@/lib/locales";
import { youtubeChannel } from "@/lib/youtube";

type NavigationLabels = {
  home: string;
  about: string;
  projects: string;
  blog: string;
  youtube: string;
  switchLanguage: string;
  primaryLabel: string;
};

function localePath(
  pathname: string,
  currentLocale: Locale,
  targetLocale: Locale,
  translatedPostPaths: Record<string, string>,
) {
  if (currentLocale === targetLocale) return pathname;

  const currentPrefix = currentLocale === "en" ? "" : `/${currentLocale}`;
  const routePath =
    currentPrefix && pathname.startsWith(`${currentPrefix}/`)
      ? pathname.slice(currentPrefix.length)
      : pathname === currentPrefix
        ? "/"
        : pathname;
  const segments = routePath.split("/");

  if (segments[1] === "blog" && segments[2]) {
    const translatedSlug = translatedPostPaths[segments[2]];

    if (translatedSlug) {
      return getLocalizedPath(targetLocale, `/blog/${translatedSlug}`);
    }

    return getLocalizedPath(targetLocale, "/blog");
  }

  return getLocalizedPath(targetLocale, routePath);
}

export default function Navigation({
  locale,
  labels,
  translatedPostPaths,
}: {
  locale: Locale;
  labels: NavigationLabels;
  translatedPostPaths: Record<string, string>;
}) {
  const pathname = usePathname();
  const homePath = getLocalizedPath(locale);
  const blogPath = getLocalizedPath(locale, "/blog");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href={homePath}
          className="text-lg font-black tracking-tight text-white transition-colors hover:text-blue-400"
          aria-label={`barbar.dev — ${labels.home}`}
        >
          barbar<span className="text-blue-400">.dev</span>
        </Link>

        <nav aria-label={labels.primaryLabel} className="flex items-center gap-1 sm:gap-2">
          <Link
            href={homePath}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            {labels.home}
          </Link>
          <Link
            href={`${homePath}#about`}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            {labels.about}
          </Link>
          <Link
            href={`${homePath}#projects`}
            className="hidden rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            {labels.projects}
          </Link>
          <Link
            href={blogPath}
            aria-current={pathname === blogPath || pathname.startsWith(`${blogPath}/`) ? "page" : undefined}
            className="rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white aria-[current=page]:bg-blue-500/10 aria-[current=page]:text-blue-300"
          >
            {labels.blog}
          </Link>
          <a
            href={youtubeChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.youtube}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Youtube aria-hidden="true" className="h-5 w-5" />
          </a>

          <span className="mx-1 h-5 w-px bg-slate-700" aria-hidden="true" />

          <div
            role="group"
            className="flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5"
            aria-label={labels.switchLanguage}
          >
            {locales.map((supportedLocale) => (
              <Link
                key={supportedLocale}
                href={localePath(pathname, locale, supportedLocale, translatedPostPaths)}
                hrefLang={supportedLocale}
                aria-label={`${labels.switchLanguage}: ${supportedLocale === "en" ? "English" : "Deutsch"}`}
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
