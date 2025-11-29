"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * Cursor state interface
 */
interface CursorState {
  /** Current X position of the cursor */
  x: number;
  /** Current Y position of the cursor */
  y: number;
  /** Whether the cursor is hovering over an interactive element */
  isHovering: boolean;
  /** Whether the cursor is visible (false when mouse leaves window) */
  isVisible: boolean;
}

/**
 * Cursor context interface
 */
interface CursorContextType {
  /** Current cursor state */
  cursorState: CursorState;
  /** Set hover state (called by CursorTarget) */
  setIsHovering: (hovering: boolean) => void;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

const CursorContext = createContext<CursorContextType | null>(null);

/**
 * CursorProvider - Manages global cursor state
 *
 * Features:
 * - Tracks mouse position with requestAnimationFrame for performance
 * - Manages hover state for CursorTarget components
 * - Detects when mouse leaves/enters window
 * - Respects prefers-reduced-motion preference
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isVisible: true,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Use refs for position to avoid re-renders on every mouse move
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  /**
   * Update cursor position using requestAnimationFrame for performance
   */
  const updatePosition = useCallback(() => {
    setCursorState((prev) => ({
      ...prev,
      x: positionRef.current.x,
      y: positionRef.current.y,
    }));
    rafRef.current = null;
  }, []);

  /**
   * Handle mouse move events
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      // Use requestAnimationFrame to batch position updates
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    },
    [updatePosition]
  );

  /**
   * Handle mouse entering the window
   */
  const handleMouseEnter = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isVisible: true }));
  }, []);

  /**
   * Handle mouse leaving the window
   */
  const handleMouseLeave = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  /**
   * Set hover state (called by CursorTarget)
   */
  const setIsHovering = useCallback((hovering: boolean) => {
    setCursorState((prev) => ({ ...prev, isHovering: hovering }));
  }, []);

  /**
   * Set up event listeners and detect reduced motion preference
   */
  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);

    // Add mouse event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Cleanup
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <CursorContext.Provider
      value={{ cursorState, setIsHovering, prefersReducedMotion }}
    >
      {children}
    </CursorContext.Provider>
  );
}

/**
 * useCursor hook - Access cursor state and controls
 *
 * @returns Cursor context with state and controls
 * @throws Error if used outside CursorProvider
 */
export function useCursor(): CursorContextType {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }

  return context;
}
