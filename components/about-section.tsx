"use client";

import { AnimatedSection, AnimatedChild } from "@/components/animated-section";
import { BioCard } from "@/components/bio-card";
import { AchievementCard } from "@/components/achievement-card";
import { Timeline } from "@/components/timeline";
import { EducationCard } from "@/components/education-card";
import { SkillCategory } from "@/components/skill-category";
import { getAboutData } from "@/lib/about";
import { cn } from "@/lib/utils";

/**
 * AboutSection - The About/CV section on the homepage.
 *
 * Layout:
 * - Desktop (≥1024px): 2-column grid with Bio+Achievements (60%) / Timeline (40%)
 * - Tablet (640px-1023px): Bio full width, 2 columns for smaller items
 * - Mobile (<640px): Single column stack
 *
 * Features:
 * - Scroll-triggered animations via AnimatedSection
 * - Staggered child animations
 * - Semantic structure with proper aria labels
 */
export function AboutSection() {
  const data = getAboutData();

  return (
    <AnimatedSection
      animation="slideLeft"
      staggerChildren
      as="section"
      className="py-16 md:py-24"
      data-testid="about-section"
    >
      <div
        id="about"
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-labelledby="about-heading"
      >
        {/* Section heading */}
        <AnimatedChild>
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-12"
          >
            About Me
          </h2>
        </AnimatedChild>

        {/* Main grid: Bio+Achievements (left) / Timeline (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
          {/* Left column: Bio + Achievements */}
          <div className="space-y-8">
            {/* Bio Card */}
            <AnimatedChild>
              <BioCard data={data} />
            </AnimatedChild>

            {/* Achievements */}
            <AnimatedChild>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Key Achievements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>
            </AnimatedChild>
          </div>

          {/* Right column: Timeline */}
          <AnimatedChild>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Experience
              </h3>
              <Timeline experiences={data.experience} />
            </div>
          </AnimatedChild>
        </div>

        {/* Education Section */}
        <AnimatedChild className="mt-12">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Education
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.education.map((edu) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          </div>
        </AnimatedChild>

        {/* Skills Section */}
        <AnimatedChild className="mt-12">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.skills.map((category) => (
                <SkillCategory key={category.category} category={category} />
              ))}
            </div>
          </div>
        </AnimatedChild>
      </div>
    </AnimatedSection>
  );
}
