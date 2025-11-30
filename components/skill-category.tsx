"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillCategory as SkillCategoryType } from "@/lib/about";

interface SkillCategoryProps {
  category: SkillCategoryType;
}

/**
 * SkillCategory - Displays a category of skills with badges.
 *
 * Features:
 * - Category heading
 * - Flex-wrap grid of skill badges
 * - Premium hover effect with lift
 */
export function SkillCategory({ category }: SkillCategoryProps) {
  return (
    <div data-testid={`skill-category-${category.category.toLowerCase().replace(/\s+/g, "-")}`}>
      <h4 className="font-semibold text-foreground mb-3">{category.category}</h4>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              "transition-all duration-150 ease-out",
              "skill-badge-hover"
            )}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
