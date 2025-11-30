import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface FeatureCardProps {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

/**
 * FeatureCard - Displays a project feature with title and description
 *
 * Per spec:
 * - Border: border border-border
 * - Background: bg-card
 * - Padding: p-4 sm:p-6
 * - Border-radius: rounded-lg
 * - Shadow: shadow-sm
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   title="AI-Powered Notes"
 *   description="Automatically organize your notes using AI."
 * />
 * ```
 */
export function FeatureCard({ title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-card rounded-lg shadow-sm p-4 sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Sparkles
          className="h-5 w-5 text-primary mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
