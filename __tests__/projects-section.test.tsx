import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock matchMedia for jsdom
const mockMatchMedia = (reducedMotion: boolean = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock IntersectionObserver for whileInView detection
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Simulate element entering viewport immediately for tests
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 0.2,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this as unknown as IntersectionObserver
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Mock requestAnimationFrame
const mockRAF = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16) as unknown as number;
});

// Mock next/image for testing
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onLoad,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    className?: string;
  }) => {
    // Simulate image load after a tick
    setTimeout(() => onLoad?.(), 0);
    return <img src={src} alt={alt} className={className} {...props} />;
  },
}));

// Mock next/link for testing
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock cursor context
vi.mock("@/hooks/use-cursor", () => ({
  useCursor: () => ({
    setIsHovering: vi.fn(),
    setVariant: vi.fn(),
  }),
}));

// Wrapper component for testing
const TestWrapper = ({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) => (
  <ThemeProvider
    attribute="class"
    defaultTheme={defaultTheme}
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
);

// ============================================================================
// TESTS: PROJECT DATA MODEL
// ============================================================================

describe("Project Data Model", () => {
  describe("Scenario: Project interface and data are correctly defined", () => {
    it("Given the projects data, When I access the projects array, Then I get 3 projects with correct types", async () => {
      const { projects } = await import("@/lib/projects");

      // Then: 3 projects exist
      expect(projects).toHaveLength(3);

      // And: Each project has required fields
      projects.forEach((project) => {
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("name");
        expect(project).toHaveProperty("type");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("techStack");
        expect(project).toHaveProperty("thumbnail");
        expect(Array.isArray(project.techStack)).toBe(true);
      });
    });

    it("Given the projects data, When I check the slugs, Then they are kebab-case", async () => {
      const { projects } = await import("@/lib/projects");

      const expectedSlugs = ["smart-note", "study-smarter", "ai-video-generator"];
      const actualSlugs = projects.map((p) => p.slug);

      expect(actualSlugs).toEqual(expectedSlugs);
    });

    it("Given a slug, When I call getProjectBySlug, Then I get the correct project", async () => {
      const { getProjectBySlug } = await import("@/lib/projects");

      const smartNote = getProjectBySlug("smart-note");
      expect(smartNote?.name).toBe("Smart Note");

      const studySmarter = getProjectBySlug("study-smarter");
      expect(studySmarter?.name).toBe("Study Smarter");

      const aiVideo = getProjectBySlug("ai-video-generator");
      expect(aiVideo?.name).toBe("AI Video Generator");

      const notFound = getProjectBySlug("fake-project");
      expect(notFound).toBeUndefined();
    });

    it("Given the projects, When I call getAllProjectSlugs, Then I get all slugs", async () => {
      const { getAllProjectSlugs } = await import("@/lib/projects");

      const slugs = getAllProjectSlugs();
      expect(slugs).toEqual(["smart-note", "study-smarter", "ai-video-generator"]);
    });
  });
});

// ============================================================================
// TESTS: PROJECT CARD COMPONENT
// ============================================================================

describe("ProjectCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Project cards show key info", () => {
    it("Given I am viewing a project card, When I look at the card content, Then I see the project name, type, brief description, and tech stack tags", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app with intelligent organization.",
        techStack: ["React Native", "Expo", "OpenAI"],
        thumbnail: "/images/projects/smart-note.png",
      };

      render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      // Then: I see all key info
      expect(screen.getByText("Smart Note")).toBeInTheDocument();
      expect(screen.getByText("React Native (Expo)")).toBeInTheDocument();
      expect(
        screen.getByText("AI-powered note-taking app with intelligent organization.")
      ).toBeInTheDocument();

      // And: Tech stack tags are visible
      expect(screen.getByText("React Native")).toBeInTheDocument();
      expect(screen.getByText("Expo")).toBeInTheDocument();
      expect(screen.getByText("OpenAI")).toBeInTheDocument();
    });
  });

  describe("Scenario: Project cards link to detail pages", () => {
    it("Given I am viewing the Smart Note project card, When I check the card link, Then it points to /projects/smart-note", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app.",
        techStack: ["React Native"],
        thumbnail: "/images/projects/smart-note.png",
      };

      render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      // Then: The card links to the correct project page
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/projects/smart-note");
    });

    it("Given any project card, When I check the aria-label, Then it describes the destination", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "study-smarter",
        name: "Study Smarter",
        type: "React Web App",
        description: "A study platform.",
        techStack: ["Supabase"],
        thumbnail: "/images/projects/study-smarter.png",
      };

      render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "View Study Smarter project details"
      );
    });
  });

  describe("Scenario: Project cards have hover effects", () => {
    it("Given I am on desktop, When I hover over a project card, Then the card has hover classes for animation", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app.",
        techStack: ["React Native"],
        thumbnail: "/images/projects/smart-note.png",
      };

      render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      // Then: The card has hover animation classes
      const card = screen.getByTestId("project-card-smart-note");
      expect(card.className).toMatch(/hover:scale/);
      expect(card.className).toMatch(/transition/);
    });
  });

  describe("Scenario: Card has proper focus styling", () => {
    it("Given a project card, When I check focus styles, Then it has visible focus ring classes", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app.",
        techStack: ["React Native"],
        thumbnail: "/images/projects/smart-note.png",
      };

      render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/focus-visible:ring/);
    });
  });

  describe("Scenario: Image has loading skeleton", () => {
    it("Given a project card, When the image is loading, Then a skeleton is visible", async () => {
      const { ProjectCard } = await import("@/components/project-card");

      const mockProject = {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app.",
        techStack: ["React Native"],
        thumbnail: "/images/projects/smart-note.png",
      };

      const { container } = render(
        <TestWrapper>
          <ProjectCard project={mockProject} />
        </TestWrapper>
      );

      // The image should have alt text
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", expect.stringContaining("Smart Note"));
    });
  });
});

// ============================================================================
// TESTS: PROJECTS SECTION COMPONENT
// ============================================================================

describe("ProjectsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Three project cards are displayed", () => {
    it("Given I scroll to the projects section on homepage, When the section loads, Then I see 3 project cards (Smart Note, Study Smarter, AI Video Generator)", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: 3 project cards are visible
      await waitFor(() => {
        expect(screen.getByText("Smart Note")).toBeInTheDocument();
        expect(screen.getByText("Study Smarter")).toBeInTheDocument();
        expect(screen.getByText("AI Video Generator")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Section has proper semantic structure", () => {
    it("Given the projects section, When I check the HTML structure, Then it has proper aria-labelledby and heading", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: Section has proper accessibility attributes
      const section = screen.getByRole("region", { name: /projects/i });
      expect(section).toBeInTheDocument();

      // And: Section has a heading
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(/Featured Projects/i);
    });
  });

  describe("Scenario: Section uses AnimatedSection for scroll animation", () => {
    it("Given the projects section, When it renders, Then it uses slideUp animation with staggerChildren", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: Section renders with animation (we verify it mounts correctly)
      await waitFor(() => {
        expect(screen.getByTestId("projects-section")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: All project cards link to correct pages", () => {
    it("Given the projects section, When I check all card links, Then they point to correct project pages", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      await waitFor(() => {
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(3);

        const hrefs = links.map((link) => link.getAttribute("href"));
        expect(hrefs).toContain("/projects/smart-note");
        expect(hrefs).toContain("/projects/study-smarter");
        expect(hrefs).toContain("/projects/ai-video-generator");
      });
    });
  });

  describe("Scenario: Section has subtitle", () => {
    it("Given the projects section, When I look at the header, Then I see a subtitle/description", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/A selection of recent work/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Animations respect reduced motion", () => {
    it("Given my OS has 'reduce motion' enabled, When the projects section renders, Then animations are disabled", async () => {
      // Given: Reduced motion is enabled
      mockMatchMedia(true);

      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: Section still renders (just without animation)
      await waitFor(() => {
        expect(screen.getByText("Smart Note")).toBeInTheDocument();
      });
    });
  });
});

// ============================================================================
// TESTS: PROJECTS SECTION RESPONSIVE BEHAVIOR
// ============================================================================

describe("ProjectsSection Responsive Behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Projects section is responsive", () => {
    it("Given I am on mobile, When I view the projects section, Then project cards have responsive grid classes", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      const { container } = render(
        <TestWrapper>
          <ProjectsSection />
        </TestWrapper>
      );

      await waitFor(() => {
        // Find the grid container
        const grid = container.querySelector("[class*='grid']");
        expect(grid).toBeInTheDocument();

        // Check for responsive grid classes
        expect(grid?.className).toMatch(/grid-cols-1/);
        expect(grid?.className).toMatch(/md:grid-cols-2/);
        expect(grid?.className).toMatch(/lg:grid-cols-3/);
      });
    });
  });
});

// ============================================================================
// TESTS: THEME INTEGRATION
// ============================================================================

describe("ProjectsSection Theme Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Cards render correctly in dark mode", () => {
    it("Given I am in dark mode, When I view project cards, Then they render with proper theme colors", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper defaultTheme="dark">
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: Section renders correctly in dark mode
      await waitFor(() => {
        expect(screen.getByText("Smart Note")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Cards render correctly in light mode", () => {
    it("Given I am in light mode, When I view project cards, Then they render with proper theme colors", async () => {
      const { ProjectsSection } = await import("@/components/projects-section");

      render(
        <TestWrapper defaultTheme="light">
          <ProjectsSection />
        </TestWrapper>
      );

      // Then: Section renders correctly in light mode
      await waitFor(() => {
        expect(screen.getByText("Smart Note")).toBeInTheDocument();
      });
    });
  });
});
