"use client";

import { useCallback, type ReactNode } from "react";
import { useCursor } from "@/hooks/use-cursor";

interface CursorTargetProps {
  /** Child elements to wrap */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CursorTarget component - Wrapper for elements that should trigger cursor hover state
 *
 * Wrap any interactive element (button, link, etc.) with CursorTarget to make
 * the custom cursor grow and change color when hovering over it.
 *
 * @example
 * ```tsx
 * <CursorTarget>
 *   <Button>Click me</Button>
 * </CursorTarget>
 * ```
 */
export function CursorTarget({ children, className }: CursorTargetProps) {
  const { setIsHovering } = useCursor();

  /**
   * Handle mouse entering the target
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, [setIsHovering]);

  /**
   * Handle mouse leaving the target
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, [setIsHovering]);

  return (
    <span
      data-cursor-target="true"
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "contents" }} // Don't affect layout
    >
      {children}
    </span>
  );
}
