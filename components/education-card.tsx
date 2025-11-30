"use client";

import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CursorTarget } from "@/components/cursor-target";
import { cn } from "@/lib/utils";
import type { Education } from "@/lib/about";

interface EducationCardProps {
  education: Education;
}

/**
 * EducationCard - Displays an education entry with degree and institution.
 *
 * Features:
 * - GraduationCap icon
 * - "In Progress" badge for current degrees
 * - Subtle hover effect with scale and shadow
 */
export function EducationCard({ education }: EducationCardProps) {
  return (
    <CursorTarget>
      <Card
        className={cn(
          "flex gap-3 p-4 transition-all duration-200 ease-out",
          "hover:scale-[1.02] hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        data-testid={`education-${education.id}`}
      >
        <GraduationCap
          className="h-6 w-6 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{education.degree}</h4>
            {education.inProgress && (
              <Badge
                variant="secondary"
                className="shrink-0 bg-primary/10 text-primary dark:bg-primary/20"
                aria-label="Currently in progress"
              >
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                In Progress
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{education.institution}</p>
          <p className="text-xs text-muted-foreground">{education.period}</p>
        </div>
      </Card>
    </CursorTarget>
  );
}
