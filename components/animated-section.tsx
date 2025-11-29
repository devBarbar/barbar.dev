"use client";

import { ReactNode } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// CONSTANTS - Exported for testing
// ============================================================================

/** Animation duration in seconds (300ms) */
export const ANIMATION_DURATION = 0.3;

/** Stagger delay between child animations in seconds (100ms) */
export const STAGGER_DELAY = 0.1;

/** Easing function for animations */
const EASE_OUT: Easing = "easeOut";

/** Viewport configuration for whileInView */
export const VIEWPORT_CONFIG = {
  /** Trigger at 15% visible (within 10-20% range per spec) */
  amount: 0.15 as const,
  /** Allow replay on scroll-up */
  once: false,
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Animation variants per section type.
 * Per spec:
 * - Hero: fadeIn (on page load, not scroll-triggered)
 * - Projects: slideUp
 * - About/CV: slideLeft
 * - Contact: scale
 * - Blog Listing: slideUp
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
} as const;

export type AnimationType = keyof typeof animations;

// ============================================================================
// TYPES
// ============================================================================

export interface AnimatedSectionProps {
  /** Animation type to apply */
  animation: AnimationType;
  /** Optional delay before animation starts (in seconds) */
  delay?: number;
  /** Enable staggered child animations */
  staggerChildren?: boolean;
  /** Custom stagger delay between children (default: 0.1s) */
  staggerDelay?: number;
  /** Children to render */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as (default: section) */
  as?: "section" | "div" | "article" | "aside";
  /** Optional data-testid for testing */
  "data-testid"?: string;
}

// ============================================================================
// ANIMATED SECTION COMPONENT
// ============================================================================

/**
 * AnimatedSection - Reusable scroll-triggered animation wrapper.
 *
 * Per spec:
 * - Uses `whileInView` with `amount: 0.15` (triggers at ~15% visible)
 * - Uses `viewport={{ once: false }}` for replay on scroll-up
 * - Duration: 300ms with easeOut easing
 * - Respects `prefers-reduced-motion` (instant state, no animation)
 *
 * @example
 * ```tsx
 * <AnimatedSection animation="slideUp" staggerChildren>
 *   <h2>Section Title</h2>
 *   <ProjectCard />
 *   <ProjectCard />
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  animation,
  delay = 0,
  staggerChildren = false,
  staggerDelay = STAGGER_DELAY,
  children,
  className,
  as: Component = "section",
  "data-testid": testId,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // When reduced motion is preferred, use instant animation (duration: 0)
  const effectiveDuration = prefersReducedMotion ? 0 : ANIMATION_DURATION;

  // Get the animation variant
  const variant = animations[animation];

  // Create motion variants with proper typing
  const containerVariants: Variants = {
    initial: variant.initial,
    animate: {
      ...variant.animate,
      transition: {
        duration: effectiveDuration,
        ease: EASE_OUT,
        delay,
        ...(staggerChildren && {
          staggerChildren: staggerDelay,
        }),
      },
    },
  };

  // Child variants for staggered animations
  const childVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: effectiveDuration,
        ease: EASE_OUT,
      },
    },
  };

  // Create the motion component based on the `as` prop
  const MotionComponent = motion[Component];

  return (
    <MotionComponent
      className={cn(className)}
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={VIEWPORT_CONFIG}
      data-testid={testId}
    >
      {staggerChildren
        ? // Wrap children in motion.div for stagger effect
          Array.isArray(children)
          ? children.map((child, index) => (
              <motion.div key={index} variants={childVariants}>
                {child}
              </motion.div>
            ))
          : children
        : children}
    </MotionComponent>
  );
}

// ============================================================================
// ANIMATED CHILD COMPONENT
// ============================================================================

export interface AnimatedChildProps {
  /** Children to render */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional data-testid for testing */
  "data-testid"?: string;
}

/**
 * AnimatedChild - Use inside AnimatedSection with staggerChildren for
 * explicit control over which children animate.
 */
export function AnimatedChild({
  children,
  className,
  "data-testid": testId,
}: AnimatedChildProps) {
  const prefersReducedMotion = useReducedMotion();
  const effectiveDuration = prefersReducedMotion ? 0 : ANIMATION_DURATION;

  const childVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: effectiveDuration,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={childVariants}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}
