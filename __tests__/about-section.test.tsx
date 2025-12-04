import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
// TESTS: ABOUT DATA MODEL
// ============================================================================

describe("About Data Model", () => {
  describe("Scenario: About data interface and data are correctly defined", () => {
    it("Given the about data, When I access the data, Then I get all required fields", async () => {
      const { aboutData } = await import("@/lib/about");

      // Then: All required fields exist
      expect(aboutData).toHaveProperty("name");
      expect(aboutData).toHaveProperty("title");
      expect(aboutData).toHaveProperty("location");
      expect(aboutData).toHaveProperty("linkedInUrl");
      expect(aboutData).toHaveProperty("bio");
      expect(aboutData).toHaveProperty("achievements");
      expect(aboutData).toHaveProperty("experience");
      expect(aboutData).toHaveProperty("education");
      expect(aboutData).toHaveProperty("skills");
    });

    it("Given the about data, When I check the profile, Then I see Barbar Ahmad's info", async () => {
      const { aboutData } = await import("@/lib/about");

      expect(aboutData.name).toBe("Barbar Ahmad");
      expect(aboutData.title).toBe("Lead Software Engineer");
      expect(aboutData.location).toBe("Frankfurt, Germany");
      expect(aboutData.linkedInUrl).toBe(
        "https://www.linkedin.com/in/barbar-ahmad"
      );
    });

    it("Given the about data, When I count achievements, Then I see 5 achievements", async () => {
      const { aboutData } = await import("@/lib/about");

      expect(aboutData.achievements).toHaveLength(5);
      aboutData.achievements.forEach((achievement) => {
        expect(achievement).toHaveProperty("id");
        expect(achievement).toHaveProperty("text");
      });
    });

    it("Given the about data, When I check experience, Then I see all work history", async () => {
      const { aboutData } = await import("@/lib/about");

      expect(aboutData.experience.length).toBeGreaterThanOrEqual(3);
      aboutData.experience.forEach((exp) => {
        expect(exp).toHaveProperty("id");
        expect(exp).toHaveProperty("role");
        expect(exp).toHaveProperty("company");
        expect(exp).toHaveProperty("period");
        expect(exp).toHaveProperty("description");
      });
    });

    it("Given the about data, When I check education, Then I see 2 education entries", async () => {
      const { aboutData } = await import("@/lib/about");

      expect(aboutData.education).toHaveLength(2);
      aboutData.education.forEach((edu) => {
        expect(edu).toHaveProperty("id");
        expect(edu).toHaveProperty("degree");
        expect(edu).toHaveProperty("institution");
        expect(edu).toHaveProperty("period");
        expect(edu).toHaveProperty("inProgress");
      });
    });

    it("Given the about data, When I check skills, Then I see 4 skill categories", async () => {
      const { aboutData } = await import("@/lib/about");

      expect(aboutData.skills).toHaveLength(4);

      const categoryNames = aboutData.skills.map((s) => s.category);
      expect(categoryNames).toContain("Frontend");
      expect(categoryNames).toContain("Backend");
      expect(categoryNames).toContain("DevOps & Cloud");
      expect(categoryNames).toContain("Testing & Quality");
    });

    it("Given the about data, When I count all skills, Then I see the expected number", async () => {
      const { aboutData } = await import("@/lib/about");

      const totalSkills = aboutData.skills.reduce(
        (acc, cat) => acc + cat.skills.length,
        0
      );
      expect(totalSkills).toBeGreaterThanOrEqual(17);
    });
  });
});

// ============================================================================
// TESTS: BIO CARD COMPONENT
// ============================================================================

describe("BioCard", () => {
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

  describe("Scenario: About section displays bio", () => {
    it("Given I scroll to the About section, When the section loads, Then I see Barbar Ahmad's professional bio", async () => {
      const { BioCard } = await import("@/components/bio-card");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          <BioCard data={aboutData} />
        </TestWrapper>
      );

      // Then: I see bio info
      expect(screen.getByText("Barbar Ahmad")).toBeInTheDocument();
      expect(screen.getByText("Lead Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Frankfurt, Germany")).toBeInTheDocument();
      expect(screen.getByText(/7\+ years of experience/i)).toBeInTheDocument();
    });
  });

  describe("Scenario: LinkedIn link is present", () => {
    it("Given I am viewing the About section, When I look for social links, Then I see a LinkedIn icon link that opens in a new tab", async () => {
      const { BioCard } = await import("@/components/bio-card");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          <BioCard data={aboutData} />
        </TestWrapper>
      );

      // Then: LinkedIn link exists with correct attributes
      const linkedInLink = screen.getByTestId("linkedin-link");
      expect(linkedInLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/barbar-ahmad"
      );
      expect(linkedInLink).toHaveAttribute("target", "_blank");
      expect(linkedInLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedInLink).toHaveAttribute(
        "aria-label",
        "Visit Barbar Ahmad's LinkedIn profile (opens in new tab)"
      );
    });

    it("Given the LinkedIn button, When I check touch target size, Then it is at least 44x44px", async () => {
      const { BioCard } = await import("@/components/bio-card");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          <BioCard data={aboutData} />
        </TestWrapper>
      );

      const linkedInLink = screen.getByTestId("linkedin-link");
      // Check for h-11 w-11 classes (44px)
      expect(linkedInLink.className).toMatch(/h-11/);
      expect(linkedInLink.className).toMatch(/w-11/);
    });
  });
});

// ============================================================================
// TESTS: ACHIEVEMENT CARD COMPONENT
// ============================================================================

describe("AchievementCard", () => {
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

  describe("Scenario: Key achievements are highlighted", () => {
    it("Given I am viewing the About section, When I look at achievements, Then I see 5 key achievements with Trophy icons", async () => {
      const { AchievementCard } = await import("@/components/achievement-card");
      const { aboutData } = await import("@/lib/about");

      const { container } = render(
        <TestWrapper>
          {aboutData.achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </TestWrapper>
      );

      // Then: 5 achievement cards are rendered
      expect(screen.getAllByTestId(/^achievement-/)).toHaveLength(5);

      // And: Each has a Trophy icon (SVG element)
      const trophyIcons = container.querySelectorAll("svg");
      expect(trophyIcons.length).toBe(5);
    });

    it("Given an achievement card, When I check the hover classes, Then it has glow effect", async () => {
      const { AchievementCard } = await import("@/components/achievement-card");

      const mockAchievement = {
        id: "test-1",
        text: "Test achievement",
      };

      render(
        <TestWrapper>
          <AchievementCard achievement={mockAchievement} />
        </TestWrapper>
      );

      const card = screen.getByTestId("achievement-test-1");
      expect(card.className).toMatch(/achievement-glow/);
      expect(card.className).toMatch(/hover:scale/);
    });
  });
});

// ============================================================================
// TESTS: TIMELINE COMPONENT
// ============================================================================

describe("Timeline", () => {
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

  describe("Scenario: Work experience timeline is shown", () => {
    it("Given I am viewing the About section, When I look at experience, Then I see a vertical timeline with StoneX roles", async () => {
      const { Timeline } = await import("@/components/timeline");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          <Timeline experiences={aboutData.experience} />
        </TestWrapper>
      );

      // Then: Timeline renders with ordered list semantics
      const timeline = screen.getByRole("list", {
        name: /work experience timeline/i,
      });
      expect(timeline).toBeInTheDocument();

      // And: All experience items are rendered
      const items = screen.getAllByTestId(/^timeline-item-/);
      expect(items.length).toBe(aboutData.experience.length);
    });

    it("Given the timeline, When I check the content, Then I see roles, companies, dates, and descriptions", async () => {
      const { Timeline } = await import("@/components/timeline");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          <Timeline experiences={aboutData.experience} />
        </TestWrapper>
      );

      // Then: First role is visible
      expect(screen.getByText("Lead Software Engineer")).toBeInTheDocument();
      // Use getAllByText for multiple StoneX entries
      expect(screen.getAllByText(/StoneX Group/).length).toBeGreaterThan(0);
      expect(screen.getByText(/Jan 2023 - Present/)).toBeInTheDocument();
    });

    it("Given the timeline, When I check the structure, Then I see connecting lines", async () => {
      const { Timeline } = await import("@/components/timeline");
      const { aboutData } = await import("@/lib/about");

      const { container } = render(
        <TestWrapper>
          <Timeline experiences={aboutData.experience} />
        </TestWrapper>
      );

      // Then: Timeline has gradient lines (all but last item)
      const timelineLines = container.querySelectorAll(".timeline-line");
      expect(timelineLines.length).toBe(aboutData.experience.length - 1);
    });
  });
});

// ============================================================================
// TESTS: EDUCATION CARD COMPONENT
// ============================================================================

describe("EducationCard", () => {
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

  describe("Scenario: Education section is shown", () => {
    it("Given I am viewing the About section, When I look at education, Then I see education entries", async () => {
      const { EducationCard } = await import("@/components/education-card");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          {aboutData.education.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </TestWrapper>
      );

      // Then: Education entries are rendered
      expect(screen.getAllByTestId(/^education-/)).toHaveLength(2);
    });

    it("Given an education entry in progress, When I view it, Then I see 'In Progress' badge", async () => {
      const { EducationCard } = await import("@/components/education-card");

      const inProgressEdu = {
        id: "edu-current",
        degree: "B.Sc. Computer Science",
        institution: "Test University",
        period: "2023 - Present",
        inProgress: true,
      };

      render(
        <TestWrapper>
          <EducationCard education={inProgressEdu} />
        </TestWrapper>
      );

      // Then: "In Progress" badge is visible
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });

    it("Given a completed education entry, When I view it, Then I do not see 'In Progress' badge", async () => {
      const { EducationCard } = await import("@/components/education-card");

      const completedEdu = {
        id: "edu-completed",
        degree: "B.Sc. Computer Science",
        institution: "Test University",
        period: "2017 - 2020",
        inProgress: false,
      };

      render(
        <TestWrapper>
          <EducationCard education={completedEdu} />
        </TestWrapper>
      );

      // Then: No "In Progress" badge
      expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: SKILL CATEGORY COMPONENT
// ============================================================================

describe("SkillCategory", () => {
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

  describe("Scenario: Skills are displayed", () => {
    it("Given I am viewing the About section, When I look at skills, Then I see a categorized grid of technical skills using Badge components", async () => {
      const { SkillCategory } = await import("@/components/skill-category");
      const { aboutData } = await import("@/lib/about");

      render(
        <TestWrapper>
          {aboutData.skills.map((category) => (
            <SkillCategory key={category.category} category={category} />
          ))}
        </TestWrapper>
      );

      // Then: All 4 categories are rendered
      expect(
        screen.getByTestId("skill-category-frontend")
      ).toBeInTheDocument();
      expect(screen.getByTestId("skill-category-backend")).toBeInTheDocument();
      expect(
        screen.getByTestId("skill-category-devops-&-cloud")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("skill-category-testing-&-quality")
      ).toBeInTheDocument();
    });

    it("Given the skills section, When I check Frontend skills, Then I see React, TypeScript, Next.js, etc.", async () => {
      const { SkillCategory } = await import("@/components/skill-category");

      const frontendCategory = {
        category: "Frontend",
        skills: ["React", "React Native", "Next.js", "TypeScript", "JavaScript"],
      };

      render(
        <TestWrapper>
          <SkillCategory category={frontendCategory} />
        </TestWrapper>
      );

      // Then: All frontend skills are visible
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("Given a skill badge, When I check hover classes, Then it has lift effect", async () => {
      const { SkillCategory } = await import("@/components/skill-category");

      const category = {
        category: "Test",
        skills: ["Skill1"],
      };

      const { container } = render(
        <TestWrapper>
          <SkillCategory category={category} />
        </TestWrapper>
      );

      // Find badge and check classes
      const badge = container.querySelector("[class*='skill-badge-hover']");
      expect(badge).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: ABOUT SECTION COMPONENT
// ============================================================================

describe("AboutSection", () => {
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

  describe("Scenario: About section is accessible via navigation", () => {
    it("Given I am on any page, When I look for the About section, Then it has id='about' for anchor navigation", async () => {
      const { AboutSection } = await import("@/components/about-section");

      const { container } = render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      // Then: Section has id="about"
      const aboutAnchor = container.querySelector("#about");
      expect(aboutAnchor).toBeInTheDocument();
    });
  });

  describe("Scenario: About section displays all content", () => {
    it("Given I scroll to the About section, When it loads, Then I see bio, achievements, experience, education, and skills", async () => {
      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      await waitFor(() => {
        // Bio
        expect(screen.getByTestId("bio-card")).toBeInTheDocument();

        // Heading
        expect(screen.getByText("About Me")).toBeInTheDocument();

        // Experience section heading
        expect(screen.getByText("Experience")).toBeInTheDocument();

        // Education section heading
        expect(screen.getByText("Education")).toBeInTheDocument();

        // Skills section heading
        expect(screen.getByText("Skills")).toBeInTheDocument();

        // Key Achievements section heading
        expect(screen.getByText("Key Achievements")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: About section has proper semantic structure", () => {
    it("Given the About section, When I check the HTML structure, Then it has proper aria-labelledby and heading", async () => {
      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      // Then: Heading with correct id exists
      const heading = screen.getByRole("heading", { level: 2, name: /about/i });
      expect(heading).toHaveAttribute("id", "about-heading");
    });
  });

  describe("Scenario: About section uses AnimatedSection for scroll animation", () => {
    it("Given the About section, When it renders, Then it has test id for animation verification", async () => {
      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      // Then: Section has test id
      expect(screen.getByTestId("about-section")).toBeInTheDocument();
    });
  });

  describe("Scenario: Animations respect reduced motion", () => {
    it("Given my OS has 'reduce motion' enabled, When the About section renders, Then it still renders content", async () => {
      // Given: Reduced motion is enabled
      mockMatchMedia(true);

      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      // Then: Content still renders
      await waitFor(() => {
        expect(screen.getByText("Barbar Ahmad")).toBeInTheDocument();
      });
    });
  });
});

// ============================================================================
// TESTS: ABOUT SECTION RESPONSIVE BEHAVIOR
// ============================================================================

describe("AboutSection Responsive Behavior", () => {
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

  describe("Scenario: About section is responsive", () => {
    it("Given I am on any viewport, When I view the About section, Then it has responsive grid classes", async () => {
      const { AboutSection } = await import("@/components/about-section");

      const { container } = render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      await waitFor(() => {
        // Find the main grid container
        const grid = container.querySelector("[class*='lg:grid-cols']");
        expect(grid).toBeInTheDocument();
      });
    });

    it("Given the skills section, When I check the grid, Then it has responsive columns", async () => {
      const { AboutSection } = await import("@/components/about-section");

      const { container } = render(
        <TestWrapper>
          <AboutSection />
        </TestWrapper>
      );

      await waitFor(() => {
        // Skills should have responsive grid
        const skillsGrid = container.querySelector(
          "[class*='sm:grid-cols-2'][class*='lg:grid-cols-4']"
        );
        expect(skillsGrid).toBeInTheDocument();
      });
    });
  });
});

// ============================================================================
// TESTS: THEME INTEGRATION
// ============================================================================

describe("AboutSection Theme Integration", () => {
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

  describe("Scenario: About section renders correctly in dark mode", () => {
    it("Given I am in dark mode, When I view the About section, Then it renders properly", async () => {
      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper defaultTheme="dark">
          <AboutSection />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Barbar Ahmad")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: About section renders correctly in light mode", () => {
    it("Given I am in light mode, When I view the About section, Then it renders properly", async () => {
      const { AboutSection } = await import("@/components/about-section");

      render(
        <TestWrapper defaultTheme="light">
          <AboutSection />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Barbar Ahmad")).toBeInTheDocument();
      });
    });
  });
});

// ============================================================================
// TESTS: NAVIGATION INTEGRATION
// ============================================================================

describe("Navigation Integration", () => {
  describe("Scenario: About link exists in navigation", () => {
    it("Given the navigation items, When I check for About, Then it links to /#about", async () => {
      const { NAV_ITEMS } = await import("@/lib/navigation");

      const aboutItem = NAV_ITEMS.find((item) => item.label === "About");
      expect(aboutItem).toBeDefined();
      expect(aboutItem?.href).toBe("/#about");
      expect(aboutItem?.type).toBe("anchor");
    });

    it("Given the navigation items, When I check About position, Then it is between Projects and Blog", async () => {
      const { NAV_ITEMS } = await import("@/lib/navigation");

      const labels = NAV_ITEMS.map((item) => item.label);
      const projectsIndex = labels.indexOf("Projects");
      const aboutIndex = labels.indexOf("About");
      const blogIndex = labels.indexOf("Blog");

      expect(aboutIndex).toBeGreaterThan(projectsIndex);
      expect(aboutIndex).toBeLessThan(blogIndex);
    });
  });
});
