import { Inter } from "next/font/google";

import JsonLd from "@/components/JsonLd";
import Navigation from "@/components/Navigation";
import { getAllPosts, getPostTranslation } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { siteJsonLd } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export default function LocaleRootLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  const { nav } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";
  const translatedPostPaths = Object.fromEntries(
    getAllPosts(locale).flatMap((post) => {
      const translation = getPostTranslation(post, otherLocale);
      return translation ? [[post.slug, translation.slug]] : [];
    }),
  );

  return (
    <html lang={locale} className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}>
        <JsonLd data={siteJsonLd} />
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          {nav.skipToContent}
        </a>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
        <Navigation
          locale={locale}
          labels={nav}
          translatedPostPaths={translatedPostPaths}
        />
        {children}
      </body>
    </html>
  );
}
