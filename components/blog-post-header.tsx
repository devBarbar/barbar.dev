import { Badge } from "@/components/ui/badge";

// ============================================================================
// TYPES
// ============================================================================

export interface BlogPostHeaderProps {
  /** Post title */
  title: string;
  /** Publication date */
  publishedAt: Date;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Category tags */
  tags: string[];
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// BLOG POST HEADER COMPONENT
// ============================================================================

/**
 * BlogPostHeader - Displays blog post metadata
 *
 * Per spec:
 * - Tags as Badge components (static, non-clickable)
 * - Title as h1 with responsive sizing
 * - Date formatted as "December 3, 2025"
 * - Reading time as "X min read"
 * - Proper semantic structure
 *
 * @example
 * ```tsx
 * <BlogPostHeader
 *   title="Welcome to My Blog"
 *   publishedAt={new Date("2025-12-03")}
 *   readingTime={5}
 *   tags={["react", "nextjs"]}
 * />
 * ```
 */
export function BlogPostHeader({
  title,
  publishedAt,
  readingTime,
  tags,
  className,
}: BlogPostHeaderProps) {
  // Format date as "December 3, 2025"
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(publishedAt);

  return (
    <header className={className}>
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Post tags">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium"
              role="listitem"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h1>

      {/* Meta: Date and Reading Time */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <time dateTime={publishedAt.toISOString()}>{formattedDate}</time>
        <span className="text-muted-foreground/50" aria-hidden="true">
          •
        </span>
        <span>{readingTime} min read</span>
      </div>
    </header>
  );
}
