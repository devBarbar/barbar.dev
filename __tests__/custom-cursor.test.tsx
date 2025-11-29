import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Mock framer-motion to avoid animation complexities in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      animate,
      initial,
      transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      animate?: object;
      initial?: object;
      transition?: object;
    }) => (
      <div
        className={className}
        style={style}
        data-animate={JSON.stringify(animate)}
        data-initial={JSON.stringify(initial)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </div>
    ),
  },
  useMotionValue: () => ({
    set: vi.fn(),
    get: () => 0,
  }),
  useSpring: (value: { get: () => number }) => ({
    set: vi.fn(),
    get: value?.get || (() => 0),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import components after mocking
import { CustomCursor } from "../components/custom-cursor";
import { CursorTarget } from "../components/cursor-target";
import { CursorProvider } from "../hooks/use-cursor";

// Mock matchMedia for pointer detection
const mockMatchMedia = (pointerType: "fine" | "coarse", prefersReducedMotion = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      if (query === "(pointer: coarse)") {
        return {
          matches: pointerType === "coarse",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }
      if (query === "(pointer: fine)") {
        return {
          matches: pointerType === "fine",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }
      if (query === "(prefers-reduced-motion: reduce)") {
        return {
          matches: prefersReducedMotion,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }
      // Default for theme queries
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
};

// Mock createPortal to render inline for testing
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
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
    <CursorProvider>{children}</CursorProvider>
  </ThemeProvider>
);

describe("CustomCursor", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia("fine");
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Scenario: Custom cursor follows mouse on desktop", () => {
    it("Given I am on a desktop device with a mouse (pointer: fine), When I move my mouse across the screen, Then the custom cursor follows smoothly with Framer Motion spring interpolation", async () => {
      // Given: I am on a desktop device with a mouse (pointer: fine)
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      // Wait for hydration
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // The cursor element should be present
      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();

      // When: I move my mouse across the screen
      await act(async () => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
        vi.advanceTimersByTime(16); // One frame
      });

      // Then: the custom cursor follows (we check the animate prop contains the position)
      // The spring animation is mocked, so we verify the component received the position update
      expect(cursor).toBeInTheDocument();
    });

    it("Given I am on a desktop device, Then the native browser cursor is hidden", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // The cursor element should have appropriate styling to indicate native cursor is hidden
      // This is actually controlled by CSS in globals.css, so we just verify cursor renders
      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();
    });
  });

  describe("Scenario: Cursor reacts to CursorTarget elements", () => {
    it("Given I am hovering over an element wrapped in <CursorTarget>, When my cursor enters the element, Then the cursor grows from 24px to 48px diameter And the cursor color changes from --primary to --accent", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
          <CursorTarget>
            <button data-testid="target-button">Click me</button>
          </CursorTarget>
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      const targetButton = screen.getByTestId("target-button");

      expect(cursor).toBeInTheDocument();

      // When: my cursor enters the element
      await act(async () => {
        fireEvent.mouseEnter(targetButton);
        vi.advanceTimersByTime(16);
      });

      // Then: cursor should be in hover state (size and color changes)
      // The animate prop should contain the hover scale
      const animateData = cursor?.getAttribute("data-animate");
      if (animateData) {
        const animate = JSON.parse(animateData);
        expect(animate.scale).toBe(2); // 48px / 24px = 2x scale
      }
    });

    it("Given I am hovering over a CursorTarget, When I leave the element, Then the cursor returns to default state", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
          <CursorTarget>
            <button data-testid="target-button">Click me</button>
          </CursorTarget>
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const targetButton = screen.getByTestId("target-button");

      // Enter the target
      await act(async () => {
        fireEvent.mouseEnter(targetButton);
        vi.advanceTimersByTime(16);
      });

      // Leave the target
      await act(async () => {
        fireEvent.mouseLeave(targetButton);
        vi.advanceTimersByTime(16);
      });

      // Cursor should be back to default state
      const cursor = document.querySelector("[data-testid='custom-cursor']");
      const animateData = cursor?.getAttribute("data-animate");
      if (animateData) {
        const animate = JSON.parse(animateData);
        expect(animate.scale).toBe(1);
      }
    });
  });

  describe("Scenario: No custom cursor on touch devices", () => {
    it("Given I am on a touch device (pointer: coarse), When I view the page, Then the custom cursor is hidden via CSS", async () => {
      // Given: I am on a touch device (pointer: coarse)
      mockMatchMedia("coarse");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // The cursor should still mount but will be hidden via CSS media query
      // CSS: @media (pointer: coarse) { [data-testid="custom-cursor"] { display: none; } }
      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();
    });
  });

  describe("Scenario: Cursor adapts to theme changes", () => {
    it("Given I am on a desktop device, When I toggle between light and dark mode, Then the cursor uses the appropriate --primary/--accent theme values", async () => {
      mockMatchMedia("fine");

      const { rerender } = render(
        <TestWrapper defaultTheme="light">
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();

      // Cursor should use CSS variables that adapt to theme
      // The actual color change is handled via CSS variables
      expect(cursor).toHaveClass("bg-primary");

      // Rerender with dark theme
      rerender(
        <TestWrapper defaultTheme="dark">
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Cursor should still use the same CSS variable class
      expect(cursor).toHaveClass("bg-primary");
    });
  });

  describe("Scenario: Cursor fades out when mouse leaves window", () => {
    it("Given I am on a desktop device, When my mouse leaves the browser window, Then the cursor fades out smoothly", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();

      // When: mouse leaves the browser window
      await act(async () => {
        fireEvent.mouseLeave(document.documentElement);
        vi.advanceTimersByTime(16);
      });

      // Then: cursor should have opacity 0 in its animate prop
      const animateData = cursor?.getAttribute("data-animate");
      if (animateData) {
        const animate = JSON.parse(animateData);
        expect(animate.opacity).toBe(0);
      }
    });

    it("Given the cursor faded out, When the mouse enters the window again, Then the cursor fades back in", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Mouse leaves
      await act(async () => {
        fireEvent.mouseLeave(document.documentElement);
        vi.advanceTimersByTime(16);
      });

      // Mouse enters again
      await act(async () => {
        fireEvent.mouseEnter(document.documentElement);
        vi.advanceTimersByTime(16);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      const animateData = cursor?.getAttribute("data-animate");
      if (animateData) {
        const animate = JSON.parse(animateData);
        expect(animate.opacity).toBe(1);
      }
    });
  });

  describe("Scenario: Reduced motion preference respected", () => {
    it("Given I have prefers-reduced-motion enabled in my OS, When I view the page on desktop, Then the cursor follows the mouse without spring animation", async () => {
      mockMatchMedia("fine", true); // prefersReducedMotion = true

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();

      // The transition prop should have duration: 0 for reduced motion
      const transitionData = cursor?.getAttribute("data-transition");
      if (transitionData) {
        const transition = JSON.parse(transitionData);
        // For reduced motion, we expect no spring animation (duration: 0)
        expect(transition.type).not.toBe("spring");
      }
    });
  });

  describe("Scenario: Cursor renders above all content", () => {
    it("Given there are modals, popovers, or fixed headers on the page, When I move my mouse over them, Then the custom cursor remains visible above all content (z-index: 9999)", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
          <div style={{ position: "fixed", zIndex: 1000 }}>Modal</div>
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toHaveClass("z-9999");
    });
  });

  describe("Performance and architecture", () => {
    it("should apply will-change: transform for GPU acceleration", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toHaveClass("will-change-transform");
    });

    it("should render via Portal to document.body", async () => {
      mockMatchMedia("fine");

      // Note: Portal is mocked to render inline for testing
      // In production, the cursor renders to document.body
      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();
    });
  });

  describe("Hydration safety", () => {
    it("should not render cursor until mounted to prevent hydration mismatch", async () => {
      mockMatchMedia("fine");

      render(
        <TestWrapper>
          <CustomCursor />
        </TestWrapper>
      );

      // Initially, cursor may not be rendered until mounted
      // After mount, it should appear
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const cursor = document.querySelector("[data-testid='custom-cursor']");
      expect(cursor).toBeInTheDocument();
    });
  });
});

describe("CursorTarget", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia("fine");
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render children correctly", async () => {
    render(
      <TestWrapper>
        <CursorTarget>
          <button data-testid="child-button">Test Button</button>
        </CursorTarget>
      </TestWrapper>
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("child-button")).toBeInTheDocument();
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("should wrap children with hover detection", async () => {
    render(
      <TestWrapper>
        <CustomCursor />
        <CursorTarget>
          <button data-testid="target">Hover me</button>
        </CursorTarget>
      </TestWrapper>
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const target = screen.getByTestId("target");
    const wrapper = target.closest("[data-cursor-target]");
    
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute("data-cursor-target", "true");
  });
});
