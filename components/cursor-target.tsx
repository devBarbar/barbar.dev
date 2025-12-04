"use client";

import { useCallback, type ReactNode } from "react";
import { useCursor, type CursorVariant } from "@/hooks/use-cursor";

interface CursorTargetProps {
  /** Child elements to wrap */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Cursor variant to show on hover (default: "hover") */
  variant?: CursorVariant;
}

/**
 * CursorTarget component - Wrapper for elements that should trigger cursor hover state
 *
 * Wrap any interactive element (button, link, etc.) with CursorTarget to make
 * the custom cursor grow and change color when hovering over it.
 *
 * For text input fields, use variant="text" to show the text cursor variant.
 *
 * @example
 * ```tsx
 * <CursorTarget>
 *   <Button>Click me</Button>
 * </CursorTarget>
 *
 * <CursorTarget variant="text">
 *   <Input type="text" />
 * </CursorTarget>
 * ```
 */
export function CursorTarget({ children, className, variant = "hover" }: CursorTargetProps) {
  const { setIsHovering, setVariant } = useCursor();

  /**
   * Handle mouse entering the target
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setVariant(variant);
  }, [setIsHovering, setVariant, variant]);

  /**
   * Handle mouse leaving the target
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setVariant("default");
  }, [setIsHovering, setVariant]);

  return (
    <span
      data-cursor-target="true"
      data-cursor-variant={variant}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "contents" }} // Don't affect layout
    >
      {children}
    </span>
  );
}
