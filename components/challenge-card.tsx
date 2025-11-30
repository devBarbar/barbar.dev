import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ChallengeCardProps {
  /** Problem description */
  problem: string;
  /** Solution description */
  solution: string;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// CHALLENGE CARD COMPONENT
// ============================================================================

/**
 * ChallengeCard - Displays a challenge with problem and solution sections
 *
 * Per spec:
 * - Border: border border-border
 * - Background: bg-card
 * - Padding: p-4 sm:p-6
 * - Border-radius: rounded-lg
 * - Problem icon: text-destructive
 * - Solution icon: text-green-500
 *
 * @example
 * ```tsx
 * <ChallengeCard
 *   problem="Managing complex state across screens."
 *   solution="Implemented TanStack Query for server state."
 * />
 * ```
 */
export function ChallengeCard({
  problem,
  solution,
  className,
}: ChallengeCardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-card rounded-lg shadow-sm p-4 sm:p-6",
        className
      )}
    >
      {/* Problem Section */}
      <div className="flex items-start gap-3">
        <CircleAlert
          className="h-5 w-5 text-destructive mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <h4 className="font-semibold text-foreground">Problem</h4>
          <p className="mt-1 text-sm text-muted-foreground">{problem}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-border" />

      {/* Solution Section */}
      <div className="flex items-start gap-3">
        <CircleCheck
          className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <h4 className="font-semibold text-foreground">Solution</h4>
          <p className="mt-1 text-sm text-muted-foreground">{solution}</p>
        </div>
      </div>
    </div>
  );
}
