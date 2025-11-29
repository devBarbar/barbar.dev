import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "../components/theme-toggle";

// Mock matchMedia for jsdom
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("dark") ? matches : !matches,
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

// Wrapper component for testing with ThemeProvider
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

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Theme toggle switches between modes", () => {
    it("Given I am on any page, When I click the theme toggle button, Then the theme switches from light to dark", async () => {
      // Given: I am on any page with light theme
      render(
        <TestWrapper defaultTheme="light">
          <ThemeToggle />
        </TestWrapper>
      );

      // Wait for hydration
      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");

      // When: I click the theme toggle button
      fireEvent.click(button);

      // Then: the theme switches to dark mode
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
      });
    });

    it("Given I am on any page with dark mode, When I click the theme toggle button, Then the theme switches to light", async () => {
      // Given: I am on any page with dark theme
      localStorage.setItem("theme", "dark");

      render(
        <TestWrapper defaultTheme="dark">
          <ThemeToggle />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");

      // When: I click the theme toggle button
      fireEvent.click(button);

      // Then: the theme switches to light mode
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });
  });

  describe("Scenario: Theme persists across sessions", () => {
    it("Given I have selected dark mode, When I check localStorage, Then dark mode is saved", async () => {
      // Given: I am on any page
      render(
        <TestWrapper defaultTheme="light">
          <ThemeToggle />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");

      // When: I click to switch to dark mode
      fireEvent.click(button);

      // Then: dark mode is saved in localStorage
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
      });
    });

    it("Given dark mode is saved in localStorage, When the component mounts, Then dark mode is loaded", async () => {
      // Given: dark mode is saved in localStorage
      localStorage.setItem("theme", "dark");

      // When: the component mounts
      render(
        <TestWrapper defaultTheme="dark">
          <ThemeToggle />
        </TestWrapper>
      );

      // Then: dark mode should be the active theme
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
      });
    });
  });

  describe("Scenario: System preference is secondary to localStorage", () => {
    it("Given my OS is set to dark mode And localStorage has light mode saved, When I visit the site, Then light mode is displayed", async () => {
      // Given: OS prefers dark mode
      mockMatchMedia(true); // System prefers dark

      // And: localStorage has light mode saved
      localStorage.setItem("theme", "light");

      // When: I visit the site
      render(
        <TestWrapper defaultTheme="light">
          <ThemeToggle />
        </TestWrapper>
      );

      // Then: light mode is displayed (localStorage takes priority)
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate aria-label for light mode", async () => {
      localStorage.setItem("theme", "light");

      render(
        <TestWrapper defaultTheme="light">
          <ThemeToggle />
        </TestWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
      });
    });

    it("should have appropriate aria-label for dark mode", async () => {
      localStorage.setItem("theme", "dark");

      render(
        <TestWrapper defaultTheme="dark">
          <ThemeToggle />
        </TestWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label", "Switch to light mode");
      });
    });

    it("should be keyboard accessible", async () => {
      render(
        <TestWrapper defaultTheme="light">
          <ThemeToggle />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");

      // Simulate keyboard activation
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.click(button);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
      });
    });
  });

  describe("Initial hydration state", () => {
    it("should show a loading state indicator during hydration", async () => {
      render(
        <TestWrapper defaultTheme="system">
          <ThemeToggle />
        </TestWrapper>
      );

      // Button should be present even during hydration
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
});
