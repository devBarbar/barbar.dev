"use client";

import { useState, useCallback, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { CursorTarget } from "@/components/cursor-target";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectCardProps {
  /** Project data to display */
  project: Project;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// RIPPLE EFFECT HOOK
// ============================================================================

interface Ripple {
  x: number;
  y: number;
  id: number;
}

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const createRipple = useCallback((event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = nextId.current++;

    setRipples((prev) => [...prev, { x, y, id }]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  }, []);

  return { ripples, createRipple };
}

// ============================================================================
// PROJECT CARD COMPONENT
// ============================================================================

/**
 * ProjectCard - Displays a single project in a card format.
 *
 * Per spec:
 * - Full card is clickable link to /projects/[slug]
 * - Displays: thumbnail, type, name, description, tech stack badges
 * - Hover effect: scale-[1.02] with shadow elevation
 * - Ripple effect on click
 * - Skeleton loader for image
 * - Focus-visible ring for keyboard navigation
 * - CursorTarget wrapper for custom cursor integration
 *
 * @example
 * ```tsx
 * <ProjectCard project={smartNoteProject} />
 * ```
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ripples, createRipple } = useRipple();

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <CursorTarget>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.name} project details`}
        className={cn(
          // Base card styles
          "group relative block overflow-hidden rounded-xl border bg-card",
          // Shadow and transitions
          "shadow-sm transition-all duration-300",
          // Hover effects
          "hover:scale-[1.02] hover:shadow-lg",
          // Focus styles for keyboard navigation
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          className
        )}
        onClick={createRipple}
        data-testid={`project-card-${project.slug}`}
      >
        {/* Ripple effect container */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full bg-primary/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%) scale(0)",
              animation: "ripple-animation 0.6s ease-out forwards",
            }}
          />
        ))}

        {/* Thumbnail image with skeleton */}
        <div className="relative aspect-video w-full overflow-hidden">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 aspect-video rounded-none" />
          )}
          <Image
            src={project.thumbnail}
            alt={`${project.name} project screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Card content */}
        <div className="p-5">
          {/* Project type */}
          <p className="text-sm text-muted-foreground">{project.type}</p>

          {/* Project name */}
          <h3 className="mt-1 text-xl font-semibold text-foreground">
            {project.name}
          </h3>

          {/* Description with line clamp */}
          <p className="mt-2 line-clamp-2 text-muted-foreground">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </CursorTarget>
  );
}
