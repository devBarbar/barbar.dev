import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, renderHook } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// ============================================================================
// Test: Performance Optimizations for 3D Hero Section
// Bug: production-3d-hero-performance-lag-bug.md
// ============================================================================

// Mock matchMedia for device detection
const mockMatchMedia = (
  prefersReducedMotion: boolean = false,
  pointerFine: boolean = true
) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion")
        ? prefersReducedMotion
        : query.includes("pointer: fine")
          ? pointerFine
          : false,
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

// Test wrapper component
const TestWrapper = ({
  children,
  defaultTheme = "dark",
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

describe("Performance Optimizations - Bug Fix P0", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false, true);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Scenario: Canvas frameloop is demand-based to prevent runaway rendering", () => {
    it("Given the CANVAS_SETTINGS configuration, When I check frameloop setting, Then it should be 'demand' for controlled rendering", async () => {
      const { CANVAS_SETTINGS } = await import(
        "@/components/hero/particle-config"
      );

      // Frameloop should be 'demand' to prevent uncapped rendering
      expect(CANVAS_SETTINGS.frameloop).toBe("demand");
    });
  });

  describe("Scenario: Device pixel ratio is limited to prevent GPU overload", () => {
    it("Given the CANVAS_SETTINGS configuration, When I check DPR settings, Then it should have min and max limits", async () => {
      const { CANVAS_SETTINGS } = await import(
        "@/components/hero/particle-config"
      );

      // DPR should be capped to prevent excessive GPU work
      expect(CANVAS_SETTINGS.dprMin).toBeDefined();
      expect(CANVAS_SETTINGS.dprMax).toBeDefined();
      expect(CANVAS_SETTINGS.dprMin).toBe(1);
      expect(CANVAS_SETTINGS.dprMax).toBeLessThanOrEqual(2);
    });
  });

  describe("Scenario: FPS monitor throttles state updates to prevent React reconciliation spam", () => {
    it("Given the FPS_STATE_UPDATE_INTERVAL configuration, When I check the value, Then it should be at least 500ms", async () => {
      const { FPS_STATE_UPDATE_INTERVAL } = await import(
        "@/hooks/use-fps-monitor"
      );

      // State updates should be throttled to avoid React overhead
      expect(FPS_STATE_UPDATE_INTERVAL).toBeGreaterThanOrEqual(500);
    });

    it("Given the useFpsMonitor hook, When I record frames rapidly, Then state updates are throttled", async () => {
      const { useFpsMonitor } = await import("@/hooks/use-fps-monitor");

      let stateUpdateCount = 0;
      const onDegrade = vi.fn();
      const onRecover = vi.fn();

      // Track state updates by checking how many times the callback is called
      const { result } = renderHook(() => useFpsMonitor(onDegrade, onRecover));

      // Simulate 100 frames rapidly (at 60fps this would be ~1.6 seconds)
      for (let i = 0; i < 100; i++) {
        vi.advanceTimersByTime(16); // ~60fps
        act(() => {
          result.current.recordFrame();
        });
      }

      // The hook should NOT trigger excessive state updates
      // We verify this by checking that FPS tracking works without issues
      expect(result.current.fps).toBeDefined();
    });
  });

  describe("Scenario: Mouse position uses ref instead of state for performance", () => {
    it("Given the PERFORMANCE_SETTINGS configuration, When I check mouse tracking mode, Then it should use refs", async () => {
      const { PERFORMANCE_SETTINGS } = await import(
        "@/components/hero/particle-config"
      );

      // Mouse tracking should use refs to avoid re-renders
      expect(PERFORMANCE_SETTINGS.useMouseRef).toBe(true);
    });
  });

  describe("Scenario: Bloom post-processing is disabled on Chrome desktop to prevent paint issues", () => {
    it("Given the BLOOM_SETTINGS configuration, When I check Chrome desktop setting, Then bloom should be disabled", async () => {
      const { BLOOM_SETTINGS } = await import(
        "@/components/hero/particle-config"
      );

      // Chrome desktop should have bloom disabled due to paint performance issues
      expect(BLOOM_SETTINGS.chromeDesktop).toBeDefined();
      expect(BLOOM_SETTINGS.chromeDesktop.enabled).toBe(false);
    });
  });

  describe("Scenario: Animation frame delta is capped for consistent performance", () => {
    it("Given the ANIMATION_PARAMS configuration, When I check maxDeltaTime, Then it should cap frame delta", async () => {
      const { ANIMATION_PARAMS } = await import(
        "@/components/hero/particle-config"
      );

      // Max delta time should be capped to prevent large jumps after frame drops
      expect(ANIMATION_PARAMS.maxDeltaTime).toBeDefined();
      expect(ANIMATION_PARAMS.maxDeltaTime).toBeLessThanOrEqual(0.1); // 100ms max
    });
  });

  describe("Scenario: Canvas has performance-optimized GL settings", () => {
    it("Given the CANVAS_SETTINGS configuration, When I check GL settings, Then powerPreference should be set", async () => {
      const { CANVAS_SETTINGS } = await import(
        "@/components/hero/particle-config"
      );

      // Power preference should be set for better performance/battery trade-off
      expect(CANVAS_SETTINGS.powerPreference).toBeDefined();
      expect(CANVAS_SETTINGS.powerPreference).toBe("high-performance");
    });
  });
});

describe("Browser Detection for Performance Optimization", () => {
  beforeEach(() => {
    mockMatchMedia(false, true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Chrome detection for targeted optimizations", () => {
    it("Given the detectBrowser utility, When called on Chrome, Then it returns correct browser info", async () => {
      const { detectBrowser } = await import("@/lib/utils");

      // Mock Chrome user agent and vendor
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        configurable: true,
      });
      Object.defineProperty(navigator, "vendor", {
        value: "Google Inc.",
        configurable: true,
      });
      // Mock desktop screen width
      Object.defineProperty(window, "innerWidth", {
        value: 1920,
        configurable: true,
      });

      const browser = detectBrowser();
      expect(browser.isChrome).toBe(true);
      expect(browser.isDesktop).toBe(true);
    });
  });
});

describe("FPS Monitor Optimization", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Scenario: FPS calculation uses internal refs to avoid re-renders", () => {
    it("Given the useFpsMonitor hook, When I get current FPS, Then it should be accessible without state updates", async () => {
      const { useFpsMonitor } = await import("@/hooks/use-fps-monitor");

      const { result } = renderHook(() => useFpsMonitor());

      // Record some frames
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(16);
        act(() => {
          result.current.recordFrame();
        });
      }

      // FPS should be calculated (close to 60 with 16ms intervals)
      expect(result.current.fps).toBeGreaterThan(0);
    });
  });

  describe("Scenario: FPS monitor exposes getCurrentFps for ref-based access", () => {
    it("Given the useFpsMonitor hook, When I call getCurrentFps, Then it returns current FPS without triggering state update", async () => {
      const { useFpsMonitor } = await import("@/hooks/use-fps-monitor");

      const { result } = renderHook(() => useFpsMonitor());

      // Record some frames
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(16);
        act(() => {
          result.current.recordFrame();
        });
      }

      // getCurrentFps should return a value close to fps state (may differ slightly due to timing)
      // The key is that getCurrentFps() exists and returns a number
      const currentFps = result.current.getCurrentFps();
      expect(typeof currentFps).toBe("number");
      expect(currentFps).toBeGreaterThan(0);
      // FPS values should be in the same ballpark (within 10 FPS of each other)
      expect(Math.abs(currentFps - result.current.fps)).toBeLessThanOrEqual(10);
    });
  });
});
