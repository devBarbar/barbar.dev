import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogListingContent } from "@/components/blog-listing-content";

export const metadata: Metadata = {
  title: "Blog - Barbar Ahmad",
  description:
    "Read my latest articles about software engineering, React, TypeScript, and web development.",
  openGraph: {
    title: "Blog - Barbar Ahmad",
    description:
      "Read my latest articles about software engineering, React, TypeScript, and web development.",
    type: "website",
    url: "https://barbar.dev/blog",
  },
  alternates: {
    canonical: "https://barbar.dev/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
        {/* Page Header */}
        <section className="mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Thoughts on software engineering, React, TypeScript, and web
            development.
          </p>
        </section>

        {/* Blog Listing */}
        <BlogListingContent posts={posts} />
      </div>
    </main>
  );
}
