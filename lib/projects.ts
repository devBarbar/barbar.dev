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

// ============================================================================
// EXTENDED INTERFACES FOR CASE STUDY PAGES
// ============================================================================

/**
 * Tech stack item with detailed explanation for tooltips.
 */
export interface TechStackItem {
  /** Technology name */
  name: string;
  /** Brief explanation shown in tooltip */
  explanation: string;
}

/**
 * Project feature with title and description.
 */
export interface Feature {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Challenge with problem statement and solution.
 */
export interface Challenge {
  /** Problem description */
  problem: string;
  /** Solution description */
  solution: string;
}

/**
 * Extended project interface for case study pages.
 * Extends base Project with detailed content.
 */
export interface ProjectDetail extends Omit<Project, "techStack"> {
  /** Tech stack with explanations for tooltips */
  techStack: TechStackItem[];
  /** Full project description for case study page */
  fullDescription: string;
  /** Key features (~3 per project) */
  features: Feature[];
  /** Challenges and solutions (~3 per project) */
  challenges: Challenge[];
  /** Screenshot paths (16:9 aspect ratio) */
  screenshots: string[];
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
    thumbnail: "/images/projects/smart-note.svg",
  },
  {
    slug: "study-smarter",
    name: "Study Smarter",
    type: "React Web App",
    description:
      "Personalized study platform using AI to generate flashcards and quizzes.",
    techStack: ["TanStack Start", "Supabase", "OpenAI GPT-4o", "TypeScript"],
    thumbnail: "/images/projects/study-smarter.svg",
  },
  {
    slug: "ai-video-generator",
    name: "AI Video Generator",
    type: "Full-Stack Web",
    description:
      "End-to-end video generation platform powered by AI for content creators.",
    techStack: ["TanStack Start", ".NET 9 API", "MongoDB", "OpenAI"],
    thumbnail: "/images/projects/ai-video-generator.svg",
  },
];

// ============================================================================
// DETAILED PROJECT DATA FOR CASE STUDY PAGES
// ============================================================================

/**
 * Detailed project data for case study pages.
 */
export const projectDetails: ProjectDetail[] = [
  {
    slug: "smart-note",
    name: "Smart Note",
    type: "React Native (Expo)",
    description:
      "AI-powered note-taking app with intelligent organization and search capabilities.",
    fullDescription:
      "Smart Note is a mobile-first note-taking application that leverages artificial intelligence to help users organize, search, and manage their notes more efficiently. Built with React Native and Expo for cross-platform compatibility, the app integrates with OpenAI's APIs to provide intelligent features like automatic categorization, smart search, and content suggestions. The backend is powered by Appwrite, providing secure authentication and real-time data synchronization.",
    thumbnail: "/images/projects/smart-note.svg",
    techStack: [
      {
        name: "React Native",
        explanation:
          "Cross-platform mobile framework for building native iOS and Android apps with React",
      },
      {
        name: "Expo",
        explanation:
          "Development platform that simplifies React Native development with managed workflows",
      },
      {
        name: "Appwrite",
        explanation:
          "Open-source backend-as-a-service for authentication, database, and storage",
      },
      {
        name: "OpenAI",
        explanation:
          "AI APIs for natural language processing and intelligent content analysis",
      },
      {
        name: "TanStack Query",
        explanation:
          "Data fetching and caching library for managing server state efficiently",
      },
    ],
    features: [
      {
        title: "AI-Powered Organization",
        description:
          "Automatically categorizes and tags notes using natural language processing, making it easy to find related content.",
      },
      {
        title: "Smart Search",
        description:
          "Semantic search capabilities that understand context and meaning, not just keywords.",
      },
      {
        title: "Real-time Sync",
        description:
          "Seamless synchronization across all devices with offline-first architecture for uninterrupted note-taking.",
      },
    ],
    challenges: [
      {
        problem:
          "Managing complex state across multiple screens while maintaining smooth animations and transitions.",
        solution:
          "Implemented TanStack Query for server state management combined with React Native's built-in state for UI, creating a clean separation of concerns.",
      },
      {
        problem:
          "Optimizing AI API calls to minimize latency and reduce costs while maintaining responsive UX.",
        solution:
          "Developed a smart caching layer and debounced requests, batching multiple operations and using background processing for non-critical AI tasks.",
      },
      {
        problem:
          "Ensuring consistent UI/UX across iOS and Android while respecting platform conventions.",
        solution:
          "Created platform-aware components that adapt to each OS's design language while maintaining brand consistency.",
      },
    ],
    screenshots: [
      "/images/projects/smart-note-screenshot-1.svg",
      "/images/projects/smart-note-screenshot-2.svg",
      "/images/projects/smart-note-screenshot-3.svg",
    ],
  },
  {
    slug: "study-smarter",
    name: "Study Smarter",
    type: "React Web App",
    description:
      "Personalized study platform using AI to generate flashcards and quizzes.",
    fullDescription:
      "Study Smarter is an intelligent learning platform that transforms how students prepare for exams. Using GPT-4o, the application generates personalized flashcards, practice quizzes, and study guides from any uploaded content. Built with TanStack Start for optimal performance and SEO, the platform uses Supabase for authentication and real-time collaboration features, allowing study groups to share and review materials together.",
    thumbnail: "/images/projects/study-smarter.svg",
    techStack: [
      {
        name: "TanStack Start",
        explanation:
          "Full-stack React framework with server-side rendering and type-safe APIs",
      },
      {
        name: "Supabase",
        explanation:
          "Open-source Firebase alternative with PostgreSQL database and real-time subscriptions",
      },
      {
        name: "OpenAI GPT-4o",
        explanation:
          "Latest multimodal AI model for generating high-quality educational content",
      },
      {
        name: "TypeScript",
        explanation:
          "Strongly typed JavaScript for improved developer experience and code reliability",
      },
    ],
    features: [
      {
        title: "AI Flashcard Generation",
        description:
          "Upload any document or paste text to automatically generate comprehensive flashcard sets with spaced repetition scheduling.",
      },
      {
        title: "Adaptive Quizzes",
        description:
          "Dynamically generated quizzes that adapt to your knowledge level, focusing on areas that need more practice.",
      },
      {
        title: "Collaborative Study Groups",
        description:
          "Real-time collaboration features allowing students to share materials, quiz each other, and track group progress.",
      },
    ],
    challenges: [
      {
        problem:
          "Processing large documents and generating quality educational content without overwhelming the AI API or the user interface.",
        solution:
          "Implemented chunked document processing with streaming responses, showing progressive content generation to users while managing API quotas.",
      },
      {
        problem:
          "Creating an effective spaced repetition algorithm that works for diverse learning styles and content types.",
        solution:
          "Developed a hybrid algorithm combining SM-2 with user feedback signals, allowing the system to adapt to individual learning patterns over time.",
      },
      {
        problem:
          "Maintaining real-time sync in collaborative sessions while handling conflicting edits.",
        solution:
          "Leveraged Supabase real-time subscriptions with optimistic updates and conflict resolution strategies for seamless collaboration.",
      },
    ],
    screenshots: [
      "/images/projects/study-smarter-screenshot-1.svg",
      "/images/projects/study-smarter-screenshot-2.svg",
      "/images/projects/study-smarter-screenshot-3.svg",
    ],
  },
  {
    slug: "ai-video-generator",
    name: "AI Video Generator",
    type: "Full-Stack Web",
    description:
      "End-to-end video generation platform powered by AI for content creators.",
    fullDescription:
      "AI Video Generator is a comprehensive video creation platform that empowers content creators to produce professional-quality videos using artificial intelligence. The platform features a React-based frontend built with TanStack Start, backed by a robust .NET 9 API that orchestrates AI services for script generation, voice synthesis, and video compilation. MongoDB provides flexible storage for complex video project data and user assets.",
    thumbnail: "/images/projects/ai-video-generator.svg",
    techStack: [
      {
        name: "TanStack Start",
        explanation:
          "Full-stack React framework providing SSR and type-safe API routes",
      },
      {
        name: ".NET 9 API",
        explanation:
          "High-performance backend framework for building scalable REST APIs",
      },
      {
        name: "MongoDB",
        explanation:
          "Document database for flexible storage of complex video project data",
      },
      {
        name: "OpenAI",
        explanation:
          "AI services for script generation, content ideation, and natural language processing",
      },
    ],
    features: [
      {
        title: "AI Script Generation",
        description:
          "Generate engaging video scripts from simple prompts or topic ideas, with customizable tone, length, and style options.",
      },
      {
        title: "Automated Video Assembly",
        description:
          "Automatically compile videos from scripts with AI-selected stock footage, generated voiceovers, and dynamic transitions.",
      },
      {
        title: "Project Management Dashboard",
        description:
          "Comprehensive dashboard for managing multiple video projects, tracking render progress, and organizing media assets.",
      },
    ],
    challenges: [
      {
        problem:
          "Orchestrating multiple AI services (text, audio, video) while maintaining reasonable processing times and costs.",
        solution:
          "Designed a pipeline architecture with background job processing using .NET's built-in task management, with progress tracking and partial result caching.",
      },
      {
        problem:
          "Handling large video files and media assets without degrading application performance.",
        solution:
          "Implemented chunked uploads with presigned URLs, server-side transcoding queues, and CDN integration for optimized delivery.",
      },
      {
        problem:
          "Creating an intuitive interface for complex video editing operations that would typically require professional software.",
        solution:
          "Developed a timeline-based editor with drag-and-drop functionality, real-time previews, and smart defaults that make professional features accessible to beginners.",
      },
    ],
    screenshots: [
      "/images/projects/ai-video-generator-screenshot-1.svg",
      "/images/projects/ai-video-generator-screenshot-2.svg",
      "/images/projects/ai-video-generator-screenshot-3.svg",
    ],
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

/**
 * Get detailed project data by slug.
 * @param slug - The project slug to find
 * @returns The detailed project or undefined if not found
 */
export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return projectDetails.find((project) => project.slug === slug);
}
