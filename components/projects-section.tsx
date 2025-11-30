"use client";

import { AnimatedSection } from "@/components/animated-section";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import { motion, type Variants, type Easing } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ============================================================================
// CONSTANTS
// ============================================================================

/** Stagger delay between card animations (100ms) */
const STAGGER_DELAY = 0.1;

/** Animation duration for cards */
const ANIMATION_DURATION = 0.5;

/** Easing function for animations */
const EASE_OUT: Easing = "easeOut";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: EASE_OUT,
    },
  },
};

const reducedMotionCardVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const reducedMotionContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

// ============================================================================
// PROJECTS SECTION COMPONENT
// ============================================================================

/**
 * ProjectsSection - Displays featured projects in a responsive grid.
 *
 * Per spec:
 * - Uses AnimatedSection with slideUp animation
 * - 3 project cards with staggered reveal
 * - Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
 * - Proper semantic structure with aria-labelledby
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <ProjectsSection />
 * ```
 */
export function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion();

  // Use instant animation variants when reduced motion is preferred
  const effectiveCardVariants = prefersReducedMotion
    ? reducedMotionCardVariants
    : cardVariants;

  const effectiveContainerVariants = prefersReducedMotion
    ? reducedMotionContainerVariants
    : containerVariants;

  return (
    <AnimatedSection
      animation="slideUp"
      className="bg-background px-4 py-20 md:py-32"
      data-testid="projects-section"
      as="section"
    >
      {/* Section wrapper with proper a11y */}
      <div
        className="mx-auto max-w-6xl"
        role="region"
        aria-labelledby="projects-heading"
      >
        {/* Section header */}
        <header className="mb-12">
          <h2
            id="projects-heading"
            className="text-3xl font-bold text-foreground md:text-4xl"
          >
            Featured Projects
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A selection of recent work I&apos;m proud of
          </p>
        </header>

        {/* Project cards grid with stagger animation */}
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8"
          variants={effectiveContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {projects.map((project) => (
            <motion.div key={project.slug} variants={effectiveCardVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
