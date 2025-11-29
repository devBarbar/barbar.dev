"use client";

import { HeroCanvas } from "./hero-canvas";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface HeroSectionProps {
  /** Name to display in hero */
  name?: string;
  /** Title/subtitle to display */
  title?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href or onClick handler */
  ctaHref?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

/**
 * Hero Section with 3D particle background.
 *
 * Layout:
 * - Full viewport height (100vh)
 * - 3D Canvas at z-0 (background)
 * - Content overlay at z-10
 *
 * Per spec: The hero section is the immersive 3D WebGL particle canvas
 * displayed prominently on homepage.
 */
export function HeroSection({
  name = "Barbar Ahmad",
  title = "Lead Software Engineer",
  ctaText = "View My Work",
  ctaHref = "#projects",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative h-screen w-full overflow-hidden",
        "flex items-center justify-center",
        className
      )}
    >
      {/* 3D Canvas Background (z-0) */}
      <HeroCanvas />

      {/* Content Overlay (z-10) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Name */}
        <h1
          className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-bold",
            "text-foreground",
            "mb-4 theme-transition"
          )}
        >
          {name}
        </h1>

        {/* Title */}
        <p
          className={cn(
            "text-xl md:text-2xl lg:text-3xl",
            "text-muted-foreground",
            "mb-8 theme-transition"
          )}
        >
          {title}
        </p>

        {/* CTA Button */}
        <a
          href={ctaHref}
          className={cn(
            "inline-flex items-center justify-center",
            "px-8 py-4 min-h-11 min-w-11", // Touch target 44x44px
            "text-lg font-medium",
            "bg-primary text-primary-foreground",
            "rounded-full",
            "hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4",
            "focus-visible:ring-primary dark:focus-visible:ring-white",
            "focus-visible:ring-offset-background",
            "transition-all duration-300 ease-out",
            "theme-transition"
          )}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
