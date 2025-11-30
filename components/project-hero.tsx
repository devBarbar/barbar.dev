"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectHeroProps {
  /** Project name for alt text */
  name: string;
  /** Path to hero image (16:9 aspect ratio) */
  thumbnail: string;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// PROJECT HERO COMPONENT
// ============================================================================

/**
 * ProjectHero - Full-width hero image for project case study pages
 *
 * Per spec:
 * - 16:9 aspect ratio (aspect-video)
 * - Full-width, edge-to-edge
 * - Next.js Image with blur placeholder effect via Skeleton
 * - Proper alt text: "{Project Name} hero image"
 *
 * @example
 * ```tsx
 * <ProjectHero
 *   name="Smart Note"
 *   thumbnail="/images/projects/smart-note.png"
 * />
 * ```
 */
export function ProjectHero({ name, thumbnail, className }: ProjectHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-lg",
        className
      )}
    >
      {/* Skeleton placeholder while loading */}
      {!imageLoaded && (
        <Skeleton className="absolute inset-0 rounded-lg" />
      )}

      <Image
        src={thumbnail}
        alt={`${name} hero image`}
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
