"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ShareButtonsProps {
  /** The URL to share */
  url: string;
  /** The title of the content being shared */
  title: string;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// SHARE BUTTONS COMPONENT
// ============================================================================

/**
 * ShareButtons - Social sharing buttons for blog posts
 *
 * Per spec:
 * - Twitter/X: Opens intent with URL and title
 * - LinkedIn: Opens share dialog
 * - Copy Link: Copies URL to clipboard with "Copied!" feedback
 * - Ghost variant buttons with icon size (40x40px for touch)
 * - Tooltips for each button
 * - Proper ARIA labels
 *
 * @example
 * ```tsx
 * <ShareButtons url="https://barbar.dev/blog/post" title="Post Title" />
 * ```
 */
export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn("flex items-center gap-2", className)}
        role="group"
        aria-label="Share this post"
      >
        {/* Twitter/X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTwitterShare}
              aria-label="Share on X (Twitter)"
              className="min-w-11 min-h-11 w-11 h-11 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Twitter className="w-4 h-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLinkedInShare}
              aria-label="Share on LinkedIn"
              className="min-w-11 min-h-11 w-11 h-11 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Linkedin className="w-4 h-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              aria-label={copied ? "Link copied!" : "Copy link to clipboard"}
              className="min-w-11 min-h-11 w-11 h-11 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
              ) : (
                <Link2 className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? "Copied!" : "Copy link"}
          </TooltipContent>
        </Tooltip>

        {/* Screen reader announcement for copy success */}
        <div aria-live="polite" className="sr-only">
          {copied && "Link copied to clipboard"}
        </div>
      </div>
    </TooltipProvider>
  );
}
