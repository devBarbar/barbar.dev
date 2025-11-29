"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/nav-link";
import { MobileMenu } from "@/components/mobile-menu";
import { CursorTarget } from "@/components/cursor-target";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Header component - Fixed/sticky top navigation bar
 *
 * Contains:
 * - Skip to main content link (accessibility)
 * - Logo/Name linking to home
 * - Navigation links (desktop: horizontal, mobile: hamburger menu)
 * - Theme toggle button (always visible)
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-200 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-ring focus:rounded-md"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center px-4 sm:px-6">
          {/* Logo/Name */}
          <div className="shrink-0">
            <CursorTarget>
              <Link
                href="/"
                className="text-lg font-semibold text-foreground hover:opacity-80 transition-opacity"
              >
                Barbar Ahmad
              </Link>
            </CursorTarget>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden sm:flex flex-1 items-center justify-center gap-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} type={item.type}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center justify-end gap-2 ml-auto sm:ml-0">
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={toggleMenu}
              className={cn(
                "sm:hidden flex items-center justify-center",
                "min-w-11 min-h-11 w-11 h-11", // 44x44px touch target
                "text-foreground hover:bg-accent hover:text-accent-foreground",
                "rounded-md transition-colors"
              )}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
