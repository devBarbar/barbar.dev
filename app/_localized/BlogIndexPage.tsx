import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getAllPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { getBlogJsonLd } from "@/lib/seo";

export default function BlogIndexPage({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale);
  const { blog } = getDictionary(locale);
  const jsonLd = getBlogJsonLd({
    locale,
    title: blog.title,
    description: blog.introduction,
    posts,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
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
                <BlogCard key={post.slug} post={post} locale={locale} headingLevel={2} />
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
