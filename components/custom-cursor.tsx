"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";
import { cn } from "@/lib/utils";

/**
 * Default cursor size in pixels
 */
const CURSOR_SIZE = 24;

/**
 * Hover cursor size in pixels (2x default)
 */
const CURSOR_HOVER_SIZE = 48;

/**
 * Text cursor dimensions
 */
const CURSOR_TEXT_WIDTH = 2;
const CURSOR_TEXT_HEIGHT = 24;

/**
 * Spring configuration for smooth cursor movement
 */
const SPRING_CONFIG = {
  damping: 25,
  stiffness: 300,
  mass: 0.5,
};

/**
 * Spring configuration for reduced motion (instant movement)
 */
const REDUCED_MOTION_CONFIG = {
  damping: 100,
  stiffness: 1000,
  mass: 0.1,
};

/**
 * CustomCursor component - Animated cursor that follows mouse movement
 *
 * Features:
 * - Smooth spring-based animation using Framer Motion
 * - Grows and changes color on hover over CursorTarget elements
 * - Shows text cursor (I-beam) variant for text inputs
 * - Hidden on touch devices via CSS (pointer: coarse)
 * - Fades out when mouse leaves the window
 * - Respects prefers-reduced-motion preference
 * - Rendered via Portal to document.body for proper z-index stacking
 * - Uses will-change: transform for GPU acceleration
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const { cursorState, prefersReducedMotion } = useCursor();

  // Motion values for smooth cursor position
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Select spring config based on reduced motion preference
  const springConfig = prefersReducedMotion
    ? REDUCED_MOTION_CONFIG
    : SPRING_CONFIG;

  // Spring-animated position values
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate cursor offset based on variant
  const getCursorOffset = () => {
    if (cursorState.variant === "text") {
      return { x: CURSOR_TEXT_WIDTH / 2, y: CURSOR_TEXT_HEIGHT / 2 };
    }
    if (cursorState.isHovering) {
      return { x: CURSOR_HOVER_SIZE / 2, y: CURSOR_HOVER_SIZE / 2 };
    }
    return { x: CURSOR_SIZE / 2, y: CURSOR_SIZE / 2 };
  };

  // Update motion values when cursor position changes
  useEffect(() => {
    const offset = getCursorOffset();
    cursorX.set(cursorState.x - offset.x);
    cursorY.set(cursorState.y - offset.y);
  }, [cursorState.x, cursorState.y, cursorState.isHovering, cursorState.variant, cursorX, cursorY]);

  // Don't render during SSR
  if (!mounted) {
    return null;
  }

  // Text cursor variant (I-beam shape)
  if (cursorState.variant === "text" && cursorState.isHovering) {
    const textCursorElement = (
      <motion.div
        data-testid="custom-cursor"
        data-cursor-variant="text"
        className={cn(
          // Base styles
          "pointer-events-none fixed top-0 left-0",
          // Color - uses theme variables
          "bg-primary",
          // Z-index - above all content
          "z-9999",
          // GPU acceleration
          "will-change-transform",
          // Theme transition
          "theme-transition"
        )}
        style={{
          x: springX,
          y: springY,
          width: CURSOR_TEXT_WIDTH,
          height: CURSOR_TEXT_HEIGHT,
        }}
        animate={{
          opacity: cursorState.isVisible ? 1 : 0,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                type: "spring",
                damping: 20,
                stiffness: 300,
              }
        }
      />
    );

    return createPortal(textCursorElement, document.body);
  }

  // Default/hover cursor variant (circle)
  const cursorElement = (
    <motion.div
      data-testid="custom-cursor"
      data-cursor-variant={cursorState.variant}
      className={cn(
        // Base styles
        "pointer-events-none fixed top-0 left-0 rounded-full",
        // Size
        "h-6 w-6", // 24px default
        // Color - uses theme variables
        cursorState.isHovering ? "bg-accent" : "bg-primary",
        // Z-index - above all content
        "z-9999",
        // GPU acceleration
        "will-change-transform",
        // Theme transition
        "theme-transition"
      )}
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        opacity: cursorState.isVisible ? 1 : 0,
        scale: cursorState.isHovering ? 2 : 1, // Scale from 24px to 48px
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              damping: 20,
              stiffness: 300,
            }
      }
    />
  );

  // Render via Portal to document.body to avoid z-index stacking context issues
  return createPortal(cursorElement, document.body);
}
