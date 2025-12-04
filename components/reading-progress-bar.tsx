"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ============================================================================
// TYPES
// ============================================================================

export interface ReadingProgressBarProps {
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// READING PROGRESS BAR COMPONENT
// ============================================================================

/**
 * ReadingProgressBar - Shows reading progress as user scrolls through content
 *
 * Per spec:
 * - Fixed at top of viewport (z-50)
 * - Height: 3px subtle bar
 * - Track: bg-muted, Fill: bg-primary
 * - Updates on scroll with 150ms transition
 * - Proper ARIA attributes for accessibility
 * - Respects reduced motion preference
 *
 * @example
 * ```tsx
 * <ReadingProgressBar />
 * ```
 */
export function ReadingProgressBar({ className }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollableHeight = docHeight - winHeight;

    if (scrollableHeight <= 0) {
      return 0;
    }

    const scrollProgress = Math.min(
      100,
      Math.max(0, (scrollTop / scrollableHeight) * 100)
    );
    return Math.round(scrollProgress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const newProgress = calculateProgress();
      setProgress(newProgress);
    };

    // Calculate initial progress
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [calculateProgress]);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[3px] bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-primary",
          !prefersReducedMotion && "transition-all duration-150 ease-out"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
