import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectDetail } from "@/lib/projects";
import { ProjectPageContent } from "@/components/project-page-content";

// ============================================================================
// STATIC GENERATION
// ============================================================================

/**
 * Generate static params for all project slugs.
 * This enables static generation at build time for all 3 project pages.
 */
export function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ============================================================================
// METADATA GENERATION
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic metadata for each project page.
 *
 * Per spec:
 * - Title: "{Project Name} | Barbar Ahmad"
 * - Description: Project's fullDescription (truncated)
 * - OG Image: Project's thumbnail
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) {
    return {
      title: "Project Not Found | Barbar Ahmad",
    };
  }

  // Truncate description for meta (max ~160 chars)
  const truncatedDescription =
    project.fullDescription.length > 155
      ? project.fullDescription.slice(0, 155) + "..."
      : project.fullDescription;

  return {
    title: `${project.name} | Barbar Ahmad`,
    description: truncatedDescription,
    openGraph: {
      title: `${project.name} | Barbar Ahmad`,
      description: truncatedDescription,
      type: "article",
      images: [
        {
          url: project.thumbnail,
          width: 1280,
          height: 720,
          alt: `${project.name} project screenshot`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Barbar Ahmad`,
      description: truncatedDescription,
      images: [project.thumbnail],
    },
  };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

/**
 * Project case study page.
 *
 * Dynamic route: /projects/[slug]
 * Displays detailed project information with sections for:
 * - Hero image
 * - Title and description
 * - Key features
 * - Tech stack with tooltips
 * - Challenges and solutions
 * - Screenshots gallery
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  // Return 404 if project not found
  if (!project) {
    notFound();
  }

  return <ProjectPageContent project={project} />;
}
