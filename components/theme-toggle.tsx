"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ThemeToggle component - Provides a button to toggle between light and dark themes
 *
 * Features:
 * - Shows placeholder icon during SSR/hydration to prevent layout shift
 * - Binary toggle between light and dark modes only
 * - Accessible with proper aria-labels
 * - Keyboard accessible (Enter/Space activation)
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Toggle between light and dark themes
   * Uses resolvedTheme to handle 'system' theme correctly
   */
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  /**
   * Get the appropriate aria-label based on current state
   */
  const getAriaLabel = (): string => {
    if (!mounted) return "Loading theme";
    return resolvedTheme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode";
  };

  /**
   * Render the appropriate icon based on hydration and theme state
   */
  const renderIcon = () => {
    // During SSR/hydration, show placeholder icon with reduced opacity
    if (!mounted) {
      return (
        <Monitor
          className="h-5 w-5 opacity-50"
          aria-hidden="true"
        />
      );
    }

    // After hydration, show the appropriate theme icon
    if (resolvedTheme === "dark") {
      return <Moon className="h-5 w-5" aria-hidden="true" />;
    }

    return <Sun className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={getAriaLabel()}
      aria-busy={!mounted}
      className="min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 lg:min-h-9 lg:min-w-9"
    >
      {renderIcon()}
      <span className="sr-only">{getAriaLabel()}</span>
    </Button>
  );
}
