"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface TechStackItemProps {
  /** Technology name */
  name: string;
  /** Brief explanation shown in tooltip */
  explanation: string;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// TECH STACK ITEM COMPONENT
// ============================================================================

/**
 * TechStackItem - Badge with tooltip showing tech explanation
 *
 * Per spec:
 * - Desktop: Tooltip appears on hover after ~200ms delay
 * - Mobile: Tooltip toggles on tap
 * - Badge uses secondary variant
 * - Minimum 44×44px tap area on mobile via padding
 *
 * @example
 * ```tsx
 * <TechStackItem
 *   name="React Native"
 *   explanation="Cross-platform mobile framework"
 * />
 * ```
 */
export function TechStackItem({
  name,
  explanation,
  className,
}: TechStackItemProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            // Ensure minimum tap area on mobile
            "min-h-11 min-w-fit px-3 py-2",
            // Focus ring for accessibility
            "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            className
          )}
        >
          <Badge variant="secondary" className="pointer-events-none">
            {name}
          </Badge>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{explanation}</p>
      </TooltipContent>
    </Tooltip>
  );
}
