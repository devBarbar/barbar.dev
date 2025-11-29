"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CursorTarget } from "@/components/cursor-target";
import type { NavItem } from "@/lib/navigation";

interface NavLinkProps {
  /** URL or anchor href */
  href: string;
  /** Type of navigation: route (page) or anchor (section) */
  type: NavItem["type"];
  /** Link content */
  children: ReactNode;
  /** Optional callback when link is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Variant styling for mobile vs desktop */
  variant?: "desktop" | "mobile";
}

/**
 * NavLink component - Individual navigation link with active state detection
 *
 * Handles:
 * - Route active state (pathname matching)
 * - Nested route matching (e.g., /blog/[slug] → Blog is active)
 * - Anchor links with cross-page navigation
 * - Custom cursor integration via CursorTarget
 *
 * @example
 * ```tsx
 * <NavLink href="/blog" type="route">Blog</NavLink>
 * <NavLink href="/#contact" type="anchor">Contact</NavLink>
 * ```
 */
export function NavLink({
  href,
  type,
  children,
  onClick,
  className,
  variant = "desktop",
}: NavLinkProps) {
  const pathname = usePathname();

  /**
   * Determine if this link is currently active
   * - For "/" (home), only exact match
   * - For other routes, check if pathname starts with href
   * - For anchors, we check the path part only
   */
  const isActive = useMemo(() => {
    if (type === "anchor") {
      // For anchor links like "/#contact", check the path part
      const [path] = href.split("#");
      if (path === "/" || path === "") {
        return pathname === "/";
      }
      return pathname === path || pathname.startsWith(`${path}/`);
    }

    // For route links
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }, [pathname, href, type]);

  /**
   * Handle link click
   * For anchor links, we need to handle smooth scroll
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call the optional onClick callback (e.g., to close mobile menu)
      onClick?.();

      if (type === "anchor") {
        const [path, hash] = href.split("#");

        // If we're already on the target page, just scroll to the anchor
        if (pathname === path || (path === "/" && pathname === "/") || path === "") {
          e.preventDefault();
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            // Fallback: scroll to top if anchor doesn't exist
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
        // If on different page, let the link navigate normally
        // The scroll will happen after navigation via URL hash
      }
    },
    [href, type, pathname, onClick]
  );

  const linkClasses = cn(
    // Base styles
    "relative transition-colors duration-200",
    // Desktop variant
    variant === "desktop" && [
      "text-sm text-muted-foreground hover:text-foreground",
      // Active state
      isActive && "text-foreground font-medium",
      // Underline indicator
      "after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200",
      "hover:after:w-full hover:after:left-0",
      isActive && "after:w-full after:left-0",
    ],
    // Mobile variant
    variant === "mobile" && [
      "text-2xl font-medium text-foreground/80 hover:text-foreground",
      "py-4 block w-full text-center",
      isActive && "text-primary",
    ],
    className
  );

  return (
    <CursorTarget>
      <Link
        href={href}
        onClick={handleClick}
        className={linkClasses}
        data-active={isActive}
      >
        {children}
      </Link>
    </CursorTarget>
  );
}
