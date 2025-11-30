"use client";

import Image from "next/image";
import { Linkedin, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CursorTarget } from "@/components/cursor-target";
import { cn } from "@/lib/utils";
import type { AboutData } from "@/lib/about";

interface BioCardProps {
  data: Pick<AboutData, "name" | "title" | "location" | "linkedInUrl" | "bio">;
}

/**
 * BioCard - Displays the bio section with avatar, name, title, and description.
 *
 * Features:
 * - Avatar placeholder (120x120px)
 * - Name, title, and location
 * - LinkedIn link with 44x44px touch target
 * - Bio paragraph
 */
export function BioCard({ data }: BioCardProps) {
  return (
    <Card className="p-6" data-testid="bio-card">
      <CardContent className="p-0">
        {/* Header with avatar and info */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Avatar placeholder */}
          <div
            className={cn(
              "h-[120px] w-[120px] shrink-0 rounded-full",
              "border-2 border-primary/20",
              "bg-muted flex items-center justify-center",
              "text-4xl font-bold text-muted-foreground"
            )}
            aria-hidden="true"
          >
            {data.name.charAt(0)}
          </div>

          {/* Info section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{data.name}</h3>
            <p className="text-lg text-muted-foreground">{data.title}</p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {data.location}
            </p>

            {/* LinkedIn link */}
            <CursorTarget>
              <a
                href={data.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Barbar Ahmad's LinkedIn profile (opens in new tab)"
                className={cn(
                  "inline-flex items-center justify-center mt-3",
                  "h-11 w-11 rounded-lg",
                  "text-muted-foreground hover:text-primary",
                  "transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                data-testid="linkedin-link"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </CursorTarget>
          </div>
        </div>

        {/* Bio paragraph */}
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {data.bio}
        </p>
      </CardContent>
    </Card>
  );
}
