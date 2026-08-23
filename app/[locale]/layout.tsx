import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import Navigation from "@/components/Navigation";
import { getAllPosts, getPostTranslation } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/locales";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadata } = getDictionary(locale);
  const otherLocale = locale === "en" ? "de" : "en";

  return {
    metadataBase: new URL("https://barbar.dev"),
    title: {
      default: metadata.title,
      template: `%s | Barbar Ahmad`,
    },
    description: metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        de: "/de",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Barbar Ahmad",
      title: metadata.title,
      description: metadata.description,
      url: `/${locale}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: otherLocale === "de" ? "de_DE" : "en_US",
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
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

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
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          {nav.skipToContent}
        </a>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
        <Navigation locale={locale} translatedPostPaths={translatedPostPaths} />
        {children}
      </body>
    </html>
  );
}
