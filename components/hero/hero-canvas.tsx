"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { CANVAS_SETTINGS } from "./particle-config";

// ============================================================================
// DYNAMIC IMPORT (lazy loading with SSR disabled)
// ============================================================================

const ParticlesScene = dynamic(
  () => import("./particles-scene").then((mod) => ({ default: mod.ParticlesScene })),
  {
    ssr: false,
    loading: () => null, // We handle loading state ourselves
  }
);

// ============================================================================
// WEBGL DETECTION
// ============================================================================

function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

// ============================================================================
// TYPES
// ============================================================================

type CanvasState = "loading" | "ready" | "error" | "unsupported";

// ============================================================================
// LOADING SHIMMER COMPONENT
// ============================================================================

interface LoadingShimmerProps {
  visible: boolean;
}

function LoadingShimmer({ visible }: LoadingShimmerProps) {
  if (!visible) return null;

  return (
    <div
      data-testid="hero-loading-shimmer"
      className={cn(
        "absolute inset-0 hero-loading-shimmer opacity-30",
        "transition-opacity duration-300 ease-out"
      )}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// MAIN HERO CANVAS COMPONENT
// ============================================================================

export interface HeroCanvasProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Hero Canvas wrapper component.
 * Handles:
 * - WebGL detection and fallback
 * - Lazy loading with timeout
 * - Loading shimmer animation
 * - Fade transitions
 *
 * Per spec:
 * - aria-hidden="true" (purely decorative)
 * - Max 2s loading timeout
 * - Graceful fallback if WebGL unavailable
 */
export function HeroCanvas({ className }: HeroCanvasProps) {
  const [state, setState] = useState<CanvasState>("loading");
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [canvasFaded, setCanvasFaded] = useState(false);

  // Check WebGL support on mount
  useEffect(() => {
    const supported = detectWebGLSupport();
    setWebGLSupported(supported);

    if (!supported) {
      setState("unsupported");
    }
  }, []);

  // Loading timeout - fallback after 2 seconds
  useEffect(() => {
    if (state !== "loading" || webGLSupported === false) return;

    const timeout = setTimeout(() => {
      if (state === "loading") {
        setState("error");
      }
    }, CANVAS_SETTINGS.loadingTimeout);

    return () => clearTimeout(timeout);
  }, [state, webGLSupported]);

  // Handle canvas ready
  const handleReady = useCallback(() => {
    setState("ready");
    // Fade out shimmer, then fade in canvas
    setTimeout(() => {
      setCanvasFaded(true);
    }, CANVAS_SETTINGS.shimmerFadeOutDuration);
  }, []);

  // Handle canvas error
  const handleError = useCallback((error: Error) => {
    console.error("HeroCanvas error:", error);
    setState("error");
  }, []);

  // Don't render canvas if WebGL is not supported or there was an error
  const shouldRenderCanvas =
    webGLSupported !== false && state !== "error" && state !== "unsupported";

  return (
    <div
      data-testid="hero-canvas-container"
      className={cn(
        "absolute inset-0 z-0",
        "transition-opacity duration-500 ease-out",
        className
      )}
      aria-hidden="true"
    >
      {/* Loading shimmer */}
      <LoadingShimmer visible={state === "loading" && webGLSupported !== false} />

      {/* 3D Canvas */}
      {shouldRenderCanvas && (
        <div
          className={cn(
            "absolute inset-0",
            "transition-opacity duration-500 ease-out",
            canvasFaded ? "opacity-100" : "opacity-0"
          )}
        >
          <ParticlesScene onReady={handleReady} onError={handleError} />
        </div>
      )}
    </div>
  );
}

// Re-export for named imports
export { ParticlesScene } from "./particles-scene";
