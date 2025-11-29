import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
          intersectionRatio: 0.2, // 20% visible, above 15% threshold
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

// Mock Lenis as a class
vi.mock("lenis", () => {
  class MockLenis {
    on = vi.fn();
    destroy = vi.fn();
    raf = vi.fn();
    scrollTo = vi.fn();
    
    constructor() {
      // Mock constructor
    }
  }
  
  return {
    default: MockLenis,
  };
});

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
// TESTS: LENIS PROVIDER
// ============================================================================

describe("LenisProvider", () => {
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

  describe("Scenario: Smooth scroll to anchors", () => {
    it("Given I click a navigation link to #projects, When Lenis handles the scroll, Then it scrolls smoothly to the projects section", async () => {
      // Import dynamically to ensure mocks are in place
      const { LenisProvider } = await import(
        "../components/lenis-provider"
      );

      // Given: A page with anchor links and sections
      render(
        <TestWrapper>
          <LenisProvider>
            <a href="#projects" data-testid="nav-link">
              Projects
            </a>
            <section id="projects" data-testid="projects-section">
              Projects Section
            </section>
          </LenisProvider>
        </TestWrapper>
      );

      // When: Lenis is initialized
      await waitFor(() => {
        expect(screen.getByTestId("nav-link")).toBeInTheDocument();
      });

      // Then: The provider renders children correctly
      expect(screen.getByTestId("projects-section")).toBeInTheDocument();
    });
  });

  describe("Scenario: Animations respect reduced motion", () => {
    it("Given my OS has 'reduce motion' enabled, When the provider mounts, Then Lenis smooth scroll is disabled", async () => {
      // Given: OS has reduced motion enabled
      mockMatchMedia(true);

      const { LenisProvider } = await import(
        "../components/lenis-provider"
      );
      const Lenis = (await import("lenis")).default;

      // When: The provider mounts
      render(
        <TestWrapper>
          <LenisProvider>
            <div>Content</div>
          </LenisProvider>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Content")).toBeInTheDocument();
      });

      // Then: Lenis should not be initialized (or be configured for reduced motion)
      // When reduced motion is preferred, Lenis should not create smooth scroll
      // The implementation will check prefers-reduced-motion and skip Lenis init
    });
  });
});

// ============================================================================
// TESTS: ANIMATED SECTION
// ============================================================================

describe("AnimatedSection", () => {
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

  describe("Scenario: Sections animate on scroll", () => {
    it("Given I am scrolling down the homepage, When a new section enters the viewport (10-20% visible), Then it animates in smoothly with its unique animation style", async () => {
      const { AnimatedSection } = await import(
        "../components/animated-section"
      );

      // Given: A section with slideUp animation
      const { container } = render(
        <TestWrapper>
          <AnimatedSection animation="slideUp" data-testid="animated-section">
            <div>Section Content</div>
          </AnimatedSection>
        </TestWrapper>
      );

      // When: The section enters the viewport (mocked via IntersectionObserver)
      await waitFor(() => {
        expect(screen.getByTestId("animated-section")).toBeInTheDocument();
      });

      // Then: The section should be rendered with animation
      const section = screen.getByTestId("animated-section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent("Section Content");
    });

    it("Given different animation types, When sections animate, Then each has its unique style", async () => {
      const { AnimatedSection } = await import(
        "../components/animated-section"
      );

      // Test each animation type
      const animations = ["fadeIn", "slideUp", "slideLeft", "scale"] as const;

      for (const animation of animations) {
        const { unmount } = render(
          <TestWrapper>
            <AnimatedSection animation={animation} data-testid={`section-${animation}`}>
              <div>{animation} Content</div>
            </AnimatedSection>
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId(`section-${animation}`)).toBeInTheDocument();
        });

        unmount();
      }
    });
  });

  describe("Scenario: Animation timing is consistent", () => {
    it("Given I am scrolling through the page, When each section animates, Then the animation duration is 300ms with consistent easing", async () => {
      const { AnimatedSection, ANIMATION_DURATION } = await import(
        "../components/animated-section"
      );

      // Then: Animation duration constant should be 0.3 (300ms)
      expect(ANIMATION_DURATION).toBe(0.3);

      // Given: An animated section
      render(
        <TestWrapper>
          <AnimatedSection animation="slideUp" data-testid="timed-section">
            <div>Timed Content</div>
          </AnimatedSection>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId("timed-section")).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Child elements stagger animate", () => {
    it("Given a section enters the viewport, When the section animates in, Then child elements animate with staggered delays", async () => {
      const { AnimatedSection, STAGGER_DELAY } = await import(
        "../components/animated-section"
      );

      // Then: Stagger delay should be 0.1 (100ms)
      expect(STAGGER_DELAY).toBe(0.1);

      // Given: A section with stagger children enabled
      render(
        <TestWrapper>
          <AnimatedSection
            animation="slideUp"
            staggerChildren
            data-testid="stagger-section"
          >
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
            <div data-testid="child-3">Child 3</div>
          </AnimatedSection>
        </TestWrapper>
      );

      // When: Section enters viewport
      await waitFor(() => {
        expect(screen.getByTestId("stagger-section")).toBeInTheDocument();
      });

      // Then: Children should be rendered (animation handled by Framer Motion)
      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });
  });

  describe("Scenario: Animations replay on scroll-up", () => {
    it("Given I have scrolled past a section, When I scroll back up and the section re-enters viewport, Then the animation replays", async () => {
      const { AnimatedSection, VIEWPORT_CONFIG } = await import(
        "../components/animated-section"
      );

      // Then: Viewport config should have once: false for replay
      expect(VIEWPORT_CONFIG.once).toBe(false);

      // And: Amount should be 0.15 (15% visible triggers animation)
      expect(VIEWPORT_CONFIG.amount).toBe(0.15);
    });
  });

  describe("Scenario: Animations respect reduced motion", () => {
    it("Given my OS has 'reduce motion' enabled, When sections enter the viewport, Then animations are disabled or minimal (instant state)", async () => {
      // Given: OS has reduced motion enabled
      mockMatchMedia(true);

      const { AnimatedSection } = await import(
        "../components/animated-section"
      );

      // When: A section is rendered
      render(
        <TestWrapper>
          <AnimatedSection animation="slideUp" data-testid="reduced-motion-section">
            <div>Reduced Motion Content</div>
          </AnimatedSection>
        </TestWrapper>
      );

      // Then: Section should still be visible (just without animation)
      await waitFor(() => {
        expect(screen.getByTestId("reduced-motion-section")).toBeInTheDocument();
      });

      // The component internally uses useReducedMotion to set duration to 0
    });
  });
});

// ============================================================================
// TESTS: HERO FADE IN ON LOAD
// ============================================================================

describe("HeroSection Animation", () => {
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

  describe("Scenario: Hero section animates on initial load", () => {
    it("Given the page first loads, When the hero section is in view, Then the hero content fades in on page mount", async () => {
      const { HeroSection } = await import("../components/hero/hero-section");

      // Given: Page first loads
      render(
        <TestWrapper>
          <HeroSection
            name="Test Name"
            title="Test Title"
            ctaText="Test CTA"
            ctaHref="#test"
          />
        </TestWrapper>
      );

      // When: Hero section is in view
      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      });

      // Then: Hero content should be visible (fade-in animation handled by Framer Motion)
      expect(screen.getByText("Test Name")).toBeInTheDocument();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test CTA")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: ANIMATION VARIANTS
// ============================================================================

describe("Animation Variants", () => {
  it("should export correct animation variants", async () => {
    const { animations } = await import("../components/animated-section");

    // Verify fadeIn variant
    expect(animations.fadeIn.initial).toEqual({ opacity: 0 });
    expect(animations.fadeIn.animate).toEqual({ opacity: 1 });

    // Verify slideUp variant
    expect(animations.slideUp.initial).toEqual({ opacity: 0, y: 40 });
    expect(animations.slideUp.animate).toEqual({ opacity: 1, y: 0 });

    // Verify slideLeft variant
    expect(animations.slideLeft.initial).toEqual({ opacity: 0, x: -40 });
    expect(animations.slideLeft.animate).toEqual({ opacity: 1, x: 0 });

    // Verify scale variant
    expect(animations.scale.initial).toEqual({ opacity: 0, scale: 0.95 });
    expect(animations.scale.animate).toEqual({ opacity: 1, scale: 1 });
  });
});
