import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { BlogPostHeader } from "@/components/blog-post-header";
import { ShareButtons } from "@/components/share-buttons";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { TableOfContents } from "@/components/table-of-contents";
import { BlogPostContent } from "./blog-post-content";

// ============================================================================
// STATIC GENERATION
// ============================================================================

/**
 * Generate static params for all blog posts at build time
 */
export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ============================================================================
// METADATA
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for the blog post page
 * Format: "{Post Title} | Blog | Barbar Ahmad"
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Blog | Barbar Ahmad",
    };
  }

  const url = `https://barbar.dev/blog/${slug}`;

  return {
    title: `${post.title} | Blog | Barbar Ahmad`,
    description: post.summary,
    openGraph: {
      title: `${post.title} | Blog | Barbar Ahmad`,
      description: post.summary,
      type: "article",
      url,
      publishedTime: post.publishedAt.toISOString(),
      authors: ["Barbar Ahmad"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
    alternates: {
      canonical: url,
    },
  };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

/**
 * Blog Post Detail Page
 *
 * Displays individual blog post with:
 * - Reading progress bar
 * - Post header with metadata
 * - Share buttons
 * - Table of contents (sticky on desktop, collapsible on mobile)
 * - MDX content
 * - Back to blog navigation
 */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Trigger 404 if post doesn't exist
  if (!post) {
    notFound();
  }

  const postUrl = `https://barbar.dev/blog/${slug}`;

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <main className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button variant="ghost" asChild className="gap-2 -ml-4">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </div>

          {/* Post Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <BlogPostHeader
              title={post.title}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              tags={post.tags}
            />

            {/* Share Buttons */}
            <div className="mt-6">
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </div>

          {/* Content Area with TOC */}
          <div className="max-w-6xl mx-auto lg:flex lg:gap-12">
            {/* Article Content */}
            <article
              className="flex-1 max-w-3xl"
              role="article"
              aria-labelledby="post-title"
            >
              <BlogPostContent slug={slug} />
            </article>

            {/* Table of Contents - Desktop Only */}
            <aside className="hidden lg:block shrink-0">
              <TableOfContents />
            </aside>
          </div>

          {/* Mobile TOC */}
          <div className="max-w-3xl mx-auto lg:hidden mt-8">
            <TableOfContents />
          </div>

          {/* Bottom Back Button */}
          <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border">
            <Button variant="ghost" asChild className="gap-2 -ml-4">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
