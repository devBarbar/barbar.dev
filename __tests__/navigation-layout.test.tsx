import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock next/navigation
const mockPathname = vi.fn();
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: mockPush }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => <div {...props}>{children}</div>,
      nav: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => <nav {...props}>{children}</nav>,
    },
  };
});

// Mock use-cursor hook
vi.mock("@/hooks/use-cursor", () => ({
  useCursor: () => ({ setIsHovering: vi.fn() }),
  CursorProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", resolvedTheme: "dark", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Import components after mocks
import { Header } from "@/components/header";
import { NavLink } from "@/components/nav-link";
import { MobileMenu } from "@/components/mobile-menu";
import { NAV_ITEMS } from "@/lib/navigation";

/**
 * Test wrapper for components that need providers
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe("Navigation & Layout Shell", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
    mockPush.mockClear();
    // Mock matchMedia for responsive tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Scenario: Navigation is visible on all pages", () => {
    it("Given I am on any page of the portfolio, When the page loads, Then I see a header with navigation links", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Verify header is present
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      // Verify logo/name is present
      expect(screen.getByText("Barbar Ahmad")).toBeInTheDocument();

      // Verify navigation links are present (on desktop view)
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("Scenario: Navigation links work correctly", () => {
    it("Given I am on the homepage, When I click on Blog in the nav, Then I am navigated to /blog", async () => {
      const user = userEvent.setup();
      mockPathname.mockReturnValue("/");

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);

      expect(blogLink).toHaveAttribute("href", "/blog");
    });
  });

  describe("Scenario: Theme toggle in header", () => {
    it("Given I am viewing the header, When I look for the theme toggle, Then I see the theme toggle icon", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Theme toggle should be present (button with Switch to dark/light mode label)
      const themeToggle = screen.getByRole("button", { name: /switch to (dark|light) mode/i });
      expect(themeToggle).toBeInTheDocument();
    });
  });

  describe("Scenario: Mobile hamburger menu", () => {
    it("Given I am on a mobile device (viewport < 640px), When I view the header, Then I see a hamburger menu icon", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes("max-width: 639px"),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Hamburger button should be present (hidden on desktop via CSS, but in DOM)
      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("Given the hamburger is clicked, When the mobile menu opens, Then I see navigation links in the overlay", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);

      // Mobile menu should now show nav links
      const mobileNav = screen.getByRole("dialog");
      expect(mobileNav).toBeInTheDocument();
    });
  });

  describe("Scenario: Mobile menu closes appropriately", () => {
    it("Given the mobile menu is open, When I click a navigation link, Then the menu closes", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <TestWrapper>
          <MobileMenu isOpen={true} onClose={onClose} />
        </TestWrapper>
      );

      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);

      expect(onClose).toHaveBeenCalled();
    });

    it("Given the mobile menu is open, When I press Escape, Then the menu closes", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <TestWrapper>
          <MobileMenu isOpen={true} onClose={onClose} />
        </TestWrapper>
      );

      await user.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Scenario: Active state on current page", () => {
    it("Given I am on /blog, When I view the navigation, Then the Blog link is visually highlighted as active", () => {
      mockPathname.mockReturnValue("/blog");

      render(
        <TestWrapper>
          <NavLink href="/blog" type="route">
            Blog
          </NavLink>
        </TestWrapper>
      );

      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toHaveAttribute("data-active", "true");
    });
  });

  describe("Scenario: Active state on nested routes", () => {
    it("Given I am on /blog/some-post, When I view the navigation, Then the Blog link is visually highlighted as active", () => {
      mockPathname.mockReturnValue("/blog/some-post");

      render(
        <TestWrapper>
          <NavLink href="/blog" type="route">
            Blog
          </NavLink>
        </TestWrapper>
      );

      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toHaveAttribute("data-active", "true");
    });

    it("Home link (/) should only be active on exact match", () => {
      mockPathname.mockReturnValue("/blog");

      render(
        <TestWrapper>
          <NavLink href="/" type="route">
            Home
          </NavLink>
        </TestWrapper>
      );

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("data-active", "false");
    });
  });

  describe("Scenario: Cross-page anchor navigation", () => {
    it("Given I am on /blog, When I click Contact in the nav, Then I am navigated to /#contact", async () => {
      const user = userEvent.setup();
      mockPathname.mockReturnValue("/blog");

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const contactLink = screen.getByRole("link", { name: /contact/i });
      expect(contactLink).toHaveAttribute("href", "/#contact");
    });
  });

  describe("Navigation Config", () => {
    it("NAV_ITEMS should contain all required navigation items", () => {
      expect(NAV_ITEMS).toHaveLength(4);

      const labels = NAV_ITEMS.map((item) => item.label);
      expect(labels).toContain("Home");
      expect(labels).toContain("Projects");
      expect(labels).toContain("Blog");
      expect(labels).toContain("Contact");
    });

    it("NAV_ITEMS should have correct types", () => {
      const home = NAV_ITEMS.find((item) => item.label === "Home");
      const blog = NAV_ITEMS.find((item) => item.label === "Blog");
      const projects = NAV_ITEMS.find((item) => item.label === "Projects");
      const contact = NAV_ITEMS.find((item) => item.label === "Contact");

      expect(home?.type).toBe("route");
      expect(blog?.type).toBe("route");
      expect(projects?.type).toBe("anchor");
      expect(contact?.type).toBe("anchor");
    });

    it("Anchor items should have hash in href", () => {
      const projects = NAV_ITEMS.find((item) => item.label === "Projects");
      const contact = NAV_ITEMS.find((item) => item.label === "Contact");

      expect(projects?.href).toBe("/#projects");
      expect(contact?.href).toBe("/#contact");
    });
  });

  describe("Accessibility", () => {
    it("Header should have skip link for keyboard navigation", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main");
    });

    it("Hamburger button should have proper aria attributes", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");
      expect(hamburgerButton).toHaveAttribute("aria-controls", "mobile-menu");
    });

    it("When hamburger is clicked, aria-expanded should be true", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);

      // After click, it should show close menu
      const closeButton = screen.getByRole("button", { name: /close menu/i });
      expect(closeButton).toHaveAttribute("aria-expanded", "true");
    });

    it("Mobile menu should have role=dialog with aria-modal", () => {
      render(
        <TestWrapper>
          <MobileMenu isOpen={true} onClose={vi.fn()} />
        </TestWrapper>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Touch targets", () => {
    it("Hamburger button should have minimum 44x44px touch target", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      // Check for min-w-11 min-h-11 classes (44px = 2.75rem = 11 in Tailwind)
      expect(hamburgerButton.className).toMatch(/min-[wh]-11|w-11|h-11/);
    });
  });
});
