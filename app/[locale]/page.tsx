import { notFound } from "next/navigation";

import About from "@/components/About";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import YouTubeSpotlight from "@/components/YouTubeSpotlight";
import { getAllPosts } from "@/lib/blog";
import { isLocale } from "@/lib/locales";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const latestPosts = getAllPosts(locale).slice(0, 3);

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col items-center justify-between">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-blue-500/20 opacity-50 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-y-1/3 rounded-full bg-cyan-500/10 opacity-50 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full">
        <Hero locale={locale} />
        <About locale={locale} />
        <Projects locale={locale} />
        <YouTubeSpotlight locale={locale} />
        <BlogPreview locale={locale} posts={latestPosts} />
      </div>

      <div className="mt-20 w-full">
        <Footer locale={locale} />
      </div>
    </main>
  );
}
