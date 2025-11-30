/**
 * Project data model for portfolio projects section.
 *
 * Per spec:
 * - 3 featured projects displayed on homepage
 * - Each project links to /projects/[slug] detail page
 */

export interface Project {
  /** URL-friendly identifier (kebab-case) */
  slug: string;
  /** Display name */
  name: string;
  /** Project type (e.g., "React Native (Expo)", "React Web App", "Full-Stack Web") */
  type: string;
  /** Brief description of the project */
  description: string;
  /** Array of technology tags */
  techStack: string[];
  /** Path to thumbnail image (16:9 aspect ratio) */
  thumbnail: string;
}

/**
 * Featured projects data.
 *
 * Per memory.instructions.md:
 * - Smart Note: React Native (Expo)
 * - Study Smarter: React Web App
 * - AI Video Generator: Full-Stack Web
 */
export const projects: Project[] = [
  {
    slug: "smart-note",
    name: "Smart Note",
    type: "React Native (Expo)",
    description:
      "AI-powered note-taking app with intelligent organization and search capabilities.",
    techStack: ["React Native", "Expo", "Appwrite", "OpenAI", "TanStack Query"],
    thumbnail: "/images/projects/smart-note.png",
  },
  {
    slug: "study-smarter",
    name: "Study Smarter",
    type: "React Web App",
    description:
      "Personalized study platform using AI to generate flashcards and quizzes.",
    techStack: ["TanStack Start", "Supabase", "OpenAI GPT-4o", "TypeScript"],
    thumbnail: "/images/projects/study-smarter.png",
  },
  {
    slug: "ai-video-generator",
    name: "AI Video Generator",
    type: "Full-Stack Web",
    description:
      "End-to-end video generation platform powered by AI for content creators.",
    techStack: ["TanStack Start", ".NET 9 API", "MongoDB", "OpenAI"],
    thumbnail: "/images/projects/ai-video-generator.png",
  },
];

/**
 * Get a project by its slug.
 * @param slug - The project slug to find
 * @returns The project or undefined if not found
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Get all project slugs (useful for static generation).
 * @returns Array of all project slugs
 */
export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
