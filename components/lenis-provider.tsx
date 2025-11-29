"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ============================================================================
// TYPES
// ============================================================================

export interface LenisProviderProps {
  /** Children to render inside the provider */
  children: ReactNode;
}

// ============================================================================
// LENIS PROVIDER COMPONENT
// ============================================================================

/**
 * LenisProvider - Wraps the application with smooth scroll functionality.
 *
 * Per spec:
 * - Integrates Lenis for smooth scrolling
 * - Respects `prefers-reduced-motion` (disables smooth scroll if enabled)
 * - Handles anchor link clicks for smooth scrolling to sections
 * - Syncs with requestAnimationFrame for smooth performance
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip Lenis initialization if user prefers reduced motion
    // This provides native scroll behavior instead
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // RequestAnimationFrame loop for smooth scroll updates
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Handle anchor link clicks for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            lenis.scrollTo(targetElement, {
              offset: 0,
              duration: 1.2,
            });
          }
        }
      }
    };

    // Add click listener for anchor links
    document.addEventListener("click", handleAnchorClick);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
