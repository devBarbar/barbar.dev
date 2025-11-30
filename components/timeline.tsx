"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/about";

interface TimelineItemProps {
  experience: Experience;
  isLast?: boolean;
}

/**
 * TimelineItem - Individual entry in the work experience timeline.
 *
 * Features:
 * - Gradient dot marker with pulse animation on hover
 * - Role, company, period, and description display
 * - Subtle highlight effect on hover
 */
export function TimelineItem({ experience, isLast = false }: TimelineItemProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.li
      className="relative flex gap-4 group"
      data-testid={`timeline-item-${experience.id}`}
      whileHover={prefersReducedMotion ? {} : { x: 4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-3 rounded-full border-2 border-background z-10",
            "bg-(--particle-primary)",
            "group-hover:timeline-dot-pulse",
            "transition-shadow duration-200",
            "group-hover:shadow-[0_0_12px_var(--particle-primary)]"
          )}
          aria-hidden="true"
        />
        {/* Connecting line (not for last item) */}
        {!isLast && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-full timeline-line"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
        <h4 className="font-semibold text-foreground">{experience.role}</h4>
        <p className="text-sm text-muted-foreground">
          {experience.company} | {experience.period}
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>
      </div>
    </motion.li>
  );
}

interface TimelineProps {
  experiences: Experience[];
}

/**
 * Timeline - Vertical timeline container for work experience.
 *
 * Features:
 * - Ordered list for semantic structure
 * - Gradient connecting line between entries
 * - Staggered animation for child items
 */
export function Timeline({ experiences }: TimelineProps) {
  return (
    <ol
      className="relative"
      aria-label="Work experience timeline"
      data-testid="timeline"
    >
      {experiences.map((experience, index) => (
        <TimelineItem
          key={experience.id}
          experience={experience}
          isLast={index === experiences.length - 1}
        />
      ))}
    </ol>
  );
}
