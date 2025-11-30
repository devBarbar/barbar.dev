import { HeroSection } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Hero Section with 3D particles */}
      <HeroSection
        name="Barbar Ahmad"
        title="Lead Software Engineer"
        ctaText="View My Work"
        ctaHref="#projects"
      />

      {/* Projects Section with featured projects */}
      <div id="projects">
        <ProjectsSection />
      </div>

      {/* About/CV Section */}
      <AboutSection />
    </div>
  );
}
