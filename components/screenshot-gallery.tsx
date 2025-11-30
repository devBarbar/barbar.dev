"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ScreenshotGalleryProps {
  /** Project name for alt text */
  projectName: string;
  /** Array of screenshot paths (16:9 aspect ratio) */
  screenshots: string[];
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// SCREENSHOT ITEM COMPONENT
// ============================================================================

interface ScreenshotItemProps {
  src: string;
  alt: string;
  index: number;
  reducedMotion: boolean;
}

function ScreenshotItem({
  src,
  alt,
  index,
  reducedMotion,
}: ScreenshotItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.5,
        delay: reducedMotion ? 0 : index * 0.1,
      }}
      viewport={{ once: false, amount: 0.15 }}
      className="relative aspect-video overflow-hidden rounded-lg"
    >
      {/* Skeleton placeholder while loading */}
      {!imageLoaded && (
        <Skeleton className="absolute inset-0 rounded-lg" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleImageLoad}
      />
    </motion.div>
  );
}

// ============================================================================
// SCREENSHOT GALLERY COMPONENT
// ============================================================================

/**
 * ScreenshotGallery - Responsive grid of project screenshots
 *
 * Per spec:
 * - Mobile (<640px): 1 column
 * - Tablet (640-1023px): 2 columns
 * - Desktop (≥1024px): 3 columns
 * - Each screenshot has proper alt text: "{Project Name} screenshot {n}"
 * - Staggered animation on scroll
 *
 * @example
 * ```tsx
 * <ScreenshotGallery
 *   projectName="Smart Note"
 *   screenshots={[
 *     "/images/projects/smart-note-screenshot-1.png",
 *     "/images/projects/smart-note-screenshot-2.png",
 *     "/images/projects/smart-note-screenshot-3.png",
 *   ]}
 * />
 * ```
 */
export function ScreenshotGallery({
  projectName,
  screenshots,
  className,
}: ScreenshotGalleryProps) {
  const reducedMotion = useReducedMotion();

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {screenshots.map((src, index) => (
        <ScreenshotItem
          key={src}
          src={src}
          alt={`${projectName} screenshot ${index + 1}`}
          index={index}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
