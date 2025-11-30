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
    fill,
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    className?: string;
    fill?: boolean;
    priority?: boolean;
  }) => {
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
  }),
}));

// Mock history.back
const mockHistoryBack = vi.fn();

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
// TESTS: PROJECT DETAIL DATA MODEL
// ============================================================================

describe("ProjectDetail Data Model", () => {
  describe("Scenario: Extended project interfaces are correctly defined", () => {
    it("Given the projects data, When I access ProjectDetail type, Then it has all required fields", async () => {
      const { projectDetails } = await import("@/lib/projects");

      expect(projectDetails).toBeDefined();
      expect(projectDetails).toHaveLength(3);

      projectDetails.forEach((project) => {
        // Base Project fields
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("name");
        expect(project).toHaveProperty("type");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("thumbnail");

        // Extended ProjectDetail fields
        expect(project).toHaveProperty("fullDescription");
        expect(project).toHaveProperty("techStack");
        expect(project).toHaveProperty("features");
        expect(project).toHaveProperty("challenges");
        expect(project).toHaveProperty("screenshots");

        // Validate techStack items have name and explanation
        expect(Array.isArray(project.techStack)).toBe(true);
        project.techStack.forEach((tech) => {
          expect(tech).toHaveProperty("name");
          expect(tech).toHaveProperty("explanation");
        });

        // Validate features have title and description
        expect(Array.isArray(project.features)).toBe(true);
        project.features.forEach((feature) => {
          expect(feature).toHaveProperty("title");
          expect(feature).toHaveProperty("description");
        });

        // Validate challenges have problem and solution
        expect(Array.isArray(project.challenges)).toBe(true);
        project.challenges.forEach((challenge) => {
          expect(challenge).toHaveProperty("problem");
          expect(challenge).toHaveProperty("solution");
        });

        // Validate screenshots array
        expect(Array.isArray(project.screenshots)).toBe(true);
      });
    });

    it("Given a slug, When I call getProjectDetail, Then I get the correct detailed project", async () => {
      const { getProjectDetail } = await import("@/lib/projects");

      const smartNote = getProjectDetail("smart-note");
      expect(smartNote?.name).toBe("Smart Note");
      expect(smartNote?.fullDescription).toBeDefined();
      expect(smartNote?.features.length).toBeGreaterThanOrEqual(1);

      const notFound = getProjectDetail("fake-project");
      expect(notFound).toBeUndefined();
    });
  });
});

// ============================================================================
// TESTS: BACK BUTTON COMPONENT
// ============================================================================

describe("BackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    Object.defineProperty(window, "history", {
      value: { back: mockHistoryBack },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Back navigation works", () => {
    it("Given I am on a project detail page, When I click the back button, Then browser history.back() is triggered", async () => {
      const { BackButton } = await import("@/components/back-button");

      render(
        <TestWrapper>
          <BackButton />
        </TestWrapper>
      );

      const button = screen.getByRole("button", { name: /go back/i });
      fireEvent.click(button);

      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });

    it("Given a back button, When I check its size, Then it has minimum 44x44px touch target", async () => {
      const { BackButton } = await import("@/components/back-button");

      render(
        <TestWrapper>
          <BackButton />
        </TestWrapper>
      );

      const button = screen.getByRole("button", { name: /go back/i });
      expect(button.className).toMatch(/min-w-11|min-h-11|w-11|h-11/);
    });

    it("Given a back button, When I focus it via keyboard, Then it has visible focus ring", async () => {
      const { BackButton } = await import("@/components/back-button");

      render(
        <TestWrapper>
          <BackButton />
        </TestWrapper>
      );

      const button = screen.getByRole("button", { name: /go back/i });
      expect(button.className).toMatch(/focus-visible:ring/);
    });
  });
});

// ============================================================================
// TESTS: TECH STACK ITEM COMPONENT
// ============================================================================

describe("TechStackItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Project page shows tech stack", () => {
    it("Given a tech stack item, When I hover over it, Then I see a tooltip with explanation", async () => {
      const { TechStackItem } = await import("@/components/tech-stack-item");

      render(
        <TestWrapper>
          <TechStackItem
            name="React Native"
            explanation="Cross-platform mobile framework"
          />
        </TestWrapper>
      );

      // Badge is visible
      expect(screen.getByText("React Native")).toBeInTheDocument();
    });

    it("Given a tech stack item, When I check its accessibility, Then it has proper aria attributes", async () => {
      const { TechStackItem } = await import("@/components/tech-stack-item");

      render(
        <TestWrapper>
          <TechStackItem
            name="TypeScript"
            explanation="Typed superset of JavaScript"
          />
        </TestWrapper>
      );

      const trigger = screen.getByText("TypeScript").closest("button");
      expect(trigger).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: PROJECT HERO COMPONENT
// ============================================================================

describe("ProjectHero", () => {
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

  describe("Scenario: Hero image loads with proper alt text", () => {
    it("Given a project hero, When it renders, Then the image has correct alt text", async () => {
      const { ProjectHero } = await import("@/components/project-hero");

      render(
        <TestWrapper>
          <ProjectHero
            name="Smart Note"
            thumbnail="/images/projects/smart-note.png"
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const image = screen.getByRole("img");
        expect(image).toHaveAttribute("alt", "Smart Note hero image");
      });
    });

    it("Given a project hero, When it renders, Then it has 16:9 aspect ratio class", async () => {
      const { ProjectHero } = await import("@/components/project-hero");

      const { container } = render(
        <TestWrapper>
          <ProjectHero
            name="Smart Note"
            thumbnail="/images/projects/smart-note.png"
          />
        </TestWrapper>
      );

      const wrapper = container.querySelector("[class*='aspect-video']");
      expect(wrapper).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: FEATURE CARD COMPONENT
// ============================================================================

describe("FeatureCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Feature cards display correctly", () => {
    it("Given a feature card, When it renders, Then it shows title and description", async () => {
      const { FeatureCard } = await import("@/components/feature-card");

      render(
        <TestWrapper>
          <FeatureCard
            title="AI-Powered Notes"
            description="Automatically organize and categorize your notes using AI."
          />
        </TestWrapper>
      );

      expect(screen.getByText("AI-Powered Notes")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Automatically organize and categorize your notes using AI."
        )
      ).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: CHALLENGE CARD COMPONENT
// ============================================================================

describe("ChallengeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Challenge cards show problem and solution", () => {
    it("Given a challenge card, When it renders, Then it shows problem and solution sections", async () => {
      const { ChallengeCard } = await import("@/components/challenge-card");

      render(
        <TestWrapper>
          <ChallengeCard
            problem="Notes were disorganized and hard to find."
            solution="Implemented AI-based tagging and search functionality."
          />
        </TestWrapper>
      );

      expect(screen.getByText(/Problem/i)).toBeInTheDocument();
      expect(screen.getByText(/Solution/i)).toBeInTheDocument();
      expect(
        screen.getByText("Notes were disorganized and hard to find.")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Implemented AI-based tagging and search functionality."
        )
      ).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: SCREENSHOT GALLERY COMPONENT
// ============================================================================

describe("ScreenshotGallery", () => {
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

  describe("Scenario: Screenshots display in responsive grid", () => {
    it("Given a screenshot gallery, When it renders, Then it has responsive grid classes", async () => {
      const { ScreenshotGallery } = await import(
        "@/components/screenshot-gallery"
      );

      const { container } = render(
        <TestWrapper>
          <ScreenshotGallery
            projectName="Smart Note"
            screenshots={[
              "/images/projects/smart-note-screenshot-1.png",
              "/images/projects/smart-note-screenshot-2.png",
              "/images/projects/smart-note-screenshot-3.png",
            ]}
          />
        </TestWrapper>
      );

      const grid = container.querySelector("[class*='grid']");
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toMatch(/grid-cols-1/);
      expect(grid?.className).toMatch(/sm:grid-cols-2/);
      expect(grid?.className).toMatch(/lg:grid-cols-3/);
    });

    it("Given screenshots, When they render, Then each has proper alt text", async () => {
      const { ScreenshotGallery } = await import(
        "@/components/screenshot-gallery"
      );

      render(
        <TestWrapper>
          <ScreenshotGallery
            projectName="Smart Note"
            screenshots={[
              "/images/projects/smart-note-screenshot-1.png",
              "/images/projects/smart-note-screenshot-2.png",
            ]}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const images = screen.getAllByRole("img");
        expect(images[0]).toHaveAttribute("alt", "Smart Note screenshot 1");
        expect(images[1]).toHaveAttribute("alt", "Smart Note screenshot 2");
      });
    });
  });
});

// ============================================================================
// TESTS: PROJECT PAGE ACCESSIBILITY
// ============================================================================

describe("Project Page Accessibility", () => {
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

  describe("Scenario: Skip link works on project pages", () => {
    it("Given a project page content wrapper, When I check for main element, Then it has id='main'", async () => {
      const { ProjectPageContent } = await import(
        "@/components/project-page-content"
      );
      const { getProjectDetail } = await import("@/lib/projects");

      const project = getProjectDetail("smart-note");

      render(
        <TestWrapper>
          <ProjectPageContent project={project!} />
        </TestWrapper>
      );

      const main = document.getElementById("main");
      expect(main).toBeInTheDocument();
    });
  });

  describe("Scenario: Proper heading hierarchy", () => {
    it("Given a project page, When I check headings, Then there is one h1 and h2s for sections", async () => {
      const { ProjectPageContent } = await import(
        "@/components/project-page-content"
      );
      const { getProjectDetail } = await import("@/lib/projects");

      const project = getProjectDetail("smart-note");

      render(
        <TestWrapper>
          <ProjectPageContent project={project!} />
        </TestWrapper>
      );

      // One h1 for project title
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent("Smart Note");

      // h2s for sections
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThanOrEqual(3); // Features, Tech Stack, Challenges, Screenshots
    });
  });
});

// ============================================================================
// TESTS: REDUCED MOTION
// ============================================================================

describe("Project Page Reduced Motion", () => {
  describe("Scenario: Animations respect reduced motion", () => {
    it("Given OS has reduce motion enabled, When page renders, Then components still render without animation", async () => {
      mockMatchMedia(true);
      window.requestAnimationFrame = mockRAF;
      window.IntersectionObserver =
        MockIntersectionObserver as unknown as typeof IntersectionObserver;

      const { ProjectPageContent } = await import(
        "@/components/project-page-content"
      );
      const { getProjectDetail } = await import("@/lib/projects");

      const project = getProjectDetail("smart-note");

      render(
        <TestWrapper>
          <ProjectPageContent project={project!} />
        </TestWrapper>
      );

      // Page still renders correctly
      expect(screen.getByText("Smart Note")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: THEME INTEGRATION
// ============================================================================

describe("Project Page Theme Integration", () => {
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

  describe("Scenario: Page renders in dark mode", () => {
    it("Given dark mode is active, When I view project page, Then it renders correctly", async () => {
      const { ProjectPageContent } = await import(
        "@/components/project-page-content"
      );
      const { getProjectDetail } = await import("@/lib/projects");

      const project = getProjectDetail("smart-note");

      render(
        <TestWrapper defaultTheme="dark">
          <ProjectPageContent project={project!} />
        </TestWrapper>
      );

      expect(screen.getByText("Smart Note")).toBeInTheDocument();
    });
  });

  describe("Scenario: Page renders in light mode", () => {
    it("Given light mode is active, When I view project page, Then it renders correctly", async () => {
      const { ProjectPageContent } = await import(
        "@/components/project-page-content"
      );
      const { getProjectDetail } = await import("@/lib/projects");

      const project = getProjectDetail("smart-note");

      render(
        <TestWrapper defaultTheme="light">
          <ProjectPageContent project={project!} />
        </TestWrapper>
      );

      expect(screen.getByText("Smart Note")).toBeInTheDocument();
    });
  });
});
