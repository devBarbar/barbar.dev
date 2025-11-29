import { HeroSection } from "@/components/hero";

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

      {/* Projects Section placeholder */}
      <section id="projects" className="min-h-screen bg-background px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground">Projects</h2>
          <p className="mt-4 text-muted-foreground">
            Coming soon...
          </p>
        </div>
      </section>
    </div>
  );
}
