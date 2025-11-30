"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface BackButtonProps {
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// BACK BUTTON COMPONENT
// ============================================================================

/**
 * BackButton - Navigation button that triggers browser history.back()
 *
 * Per spec:
 * - Uses ArrowLeft icon from lucide-react
 * - Minimum 44×44px touch target
 * - Ghost button variant
 * - Visible focus ring for keyboard navigation
 * - Triggers history.back() on click
 *
 * @example
 * ```tsx
 * <BackButton />
 * ```
 */
export function BackButton({ className }: BackButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Go back to previous page"
      className={cn(
        // Ensure minimum 44x44px touch target
        "min-w-11 min-h-11 w-11 h-11",
        // Focus ring for accessibility
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
