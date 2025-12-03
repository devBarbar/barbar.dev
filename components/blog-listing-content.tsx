"use client";

import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/blog";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogListingContentProps {
  posts: BlogPost[];
}

const POSTS_PER_PAGE = 9;

export function BlogListingContent({ posts }: BlogListingContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        post.summary.toLowerCase().includes(lowerSearchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }, [posts, searchTerm]);

  // Paginate posts
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Format date using Intl.DateTimeFormat
  const formatDate = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formatter.format(date);
  };

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
        <div className="w-20 h-20 mb-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          No blog posts available yet
        </h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Check back soon for articles about software engineering, React,
          TypeScript, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="search"
          placeholder="Search posts by title, summary, or tags..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          aria-label="Search blog posts"
          className="w-full h-12 px-4 py-3 pl-11 rounded-lg border border-input bg-card/50 text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* No results state */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No posts found
          </h3>
          <p className="text-muted-foreground max-w-sm">
            No posts found matching &ldquo;{searchTerm}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "0px 0px -15% 0px",
            }}
          >
            {paginatedPosts.map((post) => (
              <motion.div key={post.slug} variants={itemVariants}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="flex flex-col flex-1 p-6 lg:p-8">
                      {/* Date and Reading Time */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <time dateTime={post.publishedAt.toISOString()}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{post.readingTime} min read</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-muted-foreground leading-relaxed flex-1 mb-5">
                        {post.summary}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Read more link */}
                      <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-200">
                        <span>Read article</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Results count - moved above pagination */}
          <div className="text-center text-sm text-muted-foreground mt-12">
            {filteredPosts.length === 1
              ? "1 post"
              : `${filteredPosts.length} posts`}
            {searchTerm && (
              <span> matching &ldquo;{searchTerm}&rdquo;</span>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      onClick={() => setCurrentPage(page)}
                      size="icon"
                      aria-label={`Go to page ${page}${currentPage === page ? " (current)" : ""}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
