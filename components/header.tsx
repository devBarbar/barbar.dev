import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Header component - Fixed/sticky top navigation bar
 *
 * Contains:
 * - Navigation elements (future)
 * - Theme toggle button (right side)
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo/Navigation area - placeholder for future navigation */}
        <div className="flex flex-1">
          {/* Navigation items will go here */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
