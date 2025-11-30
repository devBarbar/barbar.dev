"use client";

import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CursorTarget } from "@/components/cursor-target";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/about";

interface AchievementCardProps {
  achievement: Achievement;
}

/**
 * AchievementCard - Displays an achievement with a trophy icon.
 *
 * Features:
 * - Trophy icon in amber/gold color
 * - Premium hover effect with glow and scale
 * - Integrates with custom cursor via CursorTarget
 */
export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <CursorTarget>
      <Card
        className={cn(
          "flex gap-3 p-4 transition-all duration-300 ease-out",
          "hover:scale-[1.03] hover:border-amber-500/50",
          "achievement-glow",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        data-testid={`achievement-${achievement.id}`}
      >
        <Trophy
          className="h-6 w-6 shrink-0 text-amber-500 dark:text-amber-400"
          aria-hidden="true"
        />
        <p className="text-sm text-foreground">{achievement.text}</p>
      </Card>
    </CursorTarget>
  );
}
