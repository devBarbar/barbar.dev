"use client";

import { useEffect, useState } from "react";
import { EmptyContent } from "@/components/empty-content";

interface BlogPostContentProps {
  slug: string;
}

/**
 * BlogPostContent - Client component that loads MDX content
 *
 * Uses dynamic import to load the MDX file from content/blog/
 * Handles loading states and missing content gracefully.
 */
export function BlogPostContent({ slug }: BlogPostContentProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Dynamic import of MDX content
        const mdxModule = await import(`@/content/blog/${slug}.mdx`);
        setContent(() => mdxModule.default);
      } catch (error) {
        console.error(`Failed to load MDX content for slug: ${slug}`, error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  if (hasError || !Content) {
    return <EmptyContent />;
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <Content />
    </div>
  );
}
