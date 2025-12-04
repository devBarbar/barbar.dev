import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface EmptyContentProps {
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// EMPTY CONTENT COMPONENT
// ============================================================================

/**
 * EmptyContent - Displayed when a blog post has no content
 *
 * Per spec:
 * - Centered with ghost icon
 * - Muted text styling
 * - "Content coming soon..." message
 *
 * @example
 * ```tsx
 * <EmptyContent />
 * ```
 */
export function EmptyContent({ className }: EmptyContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-muted-foreground",
        className
      )}
    >
      <FileText
        className="w-16 h-16 mb-4 opacity-50"
        aria-hidden="true"
      />
      <p className="text-lg">Content coming soon...</p>
    </div>
  );
}
