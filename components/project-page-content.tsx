"use client";

import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";
import { ProjectHero } from "@/components/project-hero";
import { TechStackItem } from "@/components/tech-stack-item";
import { FeatureCard } from "@/components/feature-card";
import { ChallengeCard } from "@/components/challenge-card";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { AnimatedSection } from "@/components/animated-section";
import type { ProjectDetail } from "@/lib/projects";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectPageContentProps {
  /** Detailed project data */
  project: ProjectDetail;
  /** Optional additional class names */
  className?: string;
}

// ============================================================================
// PROJECT PAGE CONTENT COMPONENT
// ============================================================================

/**
 * ProjectPageContent - Full content layout for project case study pages
 *
 * Per spec (layout top to bottom):
 * 1. Full-width hero image (16:9 aspect ratio)
 * 2. Back button + Project type badge
 * 3. Title (h1)
 * 4. Full description
 * 5. Features section (cards)
 * 6. Tech stack section (badges with tooltips)
 * 7. Challenges section (problem/solution cards)
 * 8. Screenshots gallery (3 images, 16:9)
 *
 * Animations:
 * - Hero: fadeIn
 * - Title/Description: slideUp
 * - Features: slideUp with stagger
 * - Tech Stack: scale
 * - Challenges: slideLeft
 * - Screenshots: slideUp with stagger
 *
 * @example
 * ```tsx
 * <ProjectPageContent project={smartNoteProject} />
 * ```
 */
export function ProjectPageContent({
  project,
  className,
}: ProjectPageContentProps) {
  return (
    <main
      id="main"
      className={cn("container max-w-7xl px-4 sm:px-6 py-8 sm:py-12", className)}
    >
      {/* Hero Image */}
      <AnimatedSection animation="fadeIn" as="div" className="mb-8">
        <ProjectHero name={project.name} thumbnail={project.thumbnail} />
      </AnimatedSection>

      {/* Back Button + Project Type */}
      <AnimatedSection animation="slideUp" as="div" className="mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <Badge variant="default">{project.type}</Badge>
        </div>
      </AnimatedSection>

      {/* Title + Description */}
      <AnimatedSection animation="slideUp" as="div" className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          {project.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {project.fullDescription}
        </p>
      </AnimatedSection>

      {/* Key Features Section */}
      <AnimatedSection
        animation="slideUp"
        staggerChildren
        as="section"
        className="mb-12"
        aria-labelledby="features-heading"
      >
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
        >
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* Tech Stack Section */}
      <AnimatedSection
        animation="scale"
        as="section"
        className="mb-12"
        aria-labelledby="tech-stack-heading"
      >
        <h2
          id="tech-stack-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
        >
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <TechStackItem
              key={tech.name}
              name={tech.name}
              explanation={tech.explanation}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* Challenges & Solutions Section */}
      <AnimatedSection
        animation="slideLeft"
        as="section"
        className="mb-12"
        aria-labelledby="challenges-heading"
      >
        <h2
          id="challenges-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
        >
          Challenges & Solutions
        </h2>
        <div className="space-y-4">
          {project.challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              problem={challenge.problem}
              solution={challenge.solution}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* Screenshots Section */}
      <AnimatedSection
        animation="slideUp"
        as="section"
        aria-labelledby="screenshots-heading"
      >
        <h2
          id="screenshots-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
        >
          Screenshots
        </h2>
        <ScreenshotGallery
          projectName={project.name}
          screenshots={project.screenshots}
        />
      </AnimatedSection>
    </main>
  );
}
