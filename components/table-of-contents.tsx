"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useLenis } from "lenis/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// TYPES
// ============================================================================

interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// TABLE OF CONTENTS COMPONENT
// ============================================================================

/**
 * TableOfContents - Automatically generated navigation from article headings
 *
 * Per spec:
 * - Extracts h2 and h3 headings from the DOM
 * - Sticky on desktop (top-24), collapsible on mobile
 * - Active state tracking with scroll position
 * - Smooth scroll to heading on click (via Lenis)
 * - Proper ARIA attributes
 * - h3 items indented under h2
 * - Only shows if ≥2 headings exist
 *
 * @example
 * ```tsx
 * <TableOfContents />
 * ```
 */
export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  // Extract headings from DOM - watches for content changes via MutationObserver
  useEffect(() => {
    const extractHeadings = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const elements = article.querySelectorAll("h2, h3");
      const extractedHeadings: TOCHeading[] = [];

      elements.forEach((el) => {
        if (el.id && el.textContent) {
          extractedHeadings.push({
            id: el.id,
            text: el.textContent,
            level: el.tagName === "H2" ? 2 : 3,
          });
        }
      });

      // Only update if headings changed to avoid unnecessary re-renders
      setHeadings((prev) => {
        const prevIds = prev.map((h) => h.id).join(",");
        const newIds = extractedHeadings.map((h) => h.id).join(",");
        return prevIds === newIds ? prev : extractedHeadings;
      });
    };

    // Initial extraction
    extractHeadings();

    // Watch for DOM changes (MDX content loads dynamically)
    const article = document.querySelector("article");
    if (!article) return;

    const observer = new MutationObserver(() => {
      extractHeadings();
    });

    observer.observe(article, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -80% 0%",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (!element) return;

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(element, {
          offset: -100,
          duration: 1.2,
        });
      } else {
        element.scrollIntoView({ behavior: "auto" });
      }

      // Focus the heading for accessibility
      element.focus({ preventScroll: true });
      setActiveId(id);

      // Close mobile menu after clicking
      setIsExpanded(false);
    },
    [lenis, prefersReducedMotion]
  );

  // Don't render if fewer than 2 headings
  if (headings.length < 2) {
    return null;
  }

  const tocContent = (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={cn(heading.level === 3 && "pl-4")}
        >
          <button
            onClick={() => scrollToHeading(heading.id)}
            aria-current={activeId === heading.id ? "true" : undefined}
            className={cn(
              "text-left text-sm w-full py-1 rounded transition-colors",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeId === heading.id
                ? "text-primary font-medium border-l-2 border-primary pl-3 -ml-3"
                : "text-muted-foreground"
            )}
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: Sticky sidebar */}
      <nav
        aria-label="Table of contents"
        className={cn(
          "hidden lg:block w-64 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto",
          className
        )}
      >
        <h2 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
          Table of Contents
        </h2>
        {tocContent}
      </nav>

      {/* Mobile: Collapsible dropdown */}
      <div className="lg:hidden mb-8">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="toc-mobile-content"
          className="w-full justify-between"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </Button>
        {isExpanded && (
          <nav
            id="toc-mobile-content"
            aria-label="Table of contents"
            className="mt-4 p-4 border rounded-lg bg-card"
          >
            {tocContent}
          </nav>
        )}
      </div>
    </>
  );
}
