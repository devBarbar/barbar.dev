"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// FPS MONITOR CONFIGURATION (per spec requirements)
// ============================================================================

/** FPS threshold below which we consider performance degraded */
export const FPS_LOW_THRESHOLD = 30;

/** FPS threshold above which we consider performance recovered */
export const FPS_RECOVERY_THRESHOLD = 45;

/** Duration (ms) FPS must stay below threshold to trigger reduction */
export const FPS_DROP_DURATION = 1000;

/** Duration (ms) FPS must stay above recovery threshold to restore particles */
export const FPS_RECOVERY_DURATION = 2000;

// ============================================================================
// TYPES
// ============================================================================

export interface FpsMonitorState {
  /** Current FPS (smoothed) */
  fps: number;
  /** Whether performance is currently degraded */
  isDegraded: boolean;
  /** Whether particles have been reduced */
  isReduced: boolean;
}

export interface UseFpsMonitorReturn extends FpsMonitorState {
  /** Call this in the animation frame loop */
  recordFrame: () => void;
  /** Reset the monitor state */
  reset: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Hook to monitor FPS and trigger adaptive performance changes.
 *
 * Per spec:
 * - FPS < 30 for 1 second → reduce particles by 50%
 * - FPS > 45 for 2 seconds → restore particles
 *
 * @param onDegrade - Called when FPS drops below threshold for sustained period
 * @param onRecover - Called when FPS recovers above threshold for sustained period
 */
export function useFpsMonitor(
  onDegrade?: () => void,
  onRecover?: () => void
): UseFpsMonitorReturn {
  const [state, setState] = useState<FpsMonitorState>({
    fps: 60,
    isDegraded: false,
    isReduced: false,
  });

  // Refs for timing calculations
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const lowFpsStartRef = useRef<number | null>(null);
  const highFpsStartRef = useRef<number | null>(null);

  // Record a frame and calculate FPS
  const recordFrame = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // Calculate instantaneous FPS
    const instantFps = delta > 0 ? 1000 / delta : 60;

    // Keep a rolling window of FPS values (last 10 frames for smoothing)
    const history = fpsHistoryRef.current;
    history.push(instantFps);
    if (history.length > 10) {
      history.shift();
    }

    // Calculate smoothed FPS (average of last 10 frames)
    const smoothedFps =
      history.reduce((sum, fps) => sum + fps, 0) / history.length;

    setState((prev) => {
      const newState = { ...prev, fps: Math.round(smoothedFps) };

      // Check for degraded performance
      if (smoothedFps < FPS_LOW_THRESHOLD && !prev.isReduced) {
        // Start tracking low FPS duration if not already
        if (lowFpsStartRef.current === null) {
          lowFpsStartRef.current = now;
        }

        // Check if we've been below threshold for long enough
        const lowDuration = now - lowFpsStartRef.current;
        if (lowDuration >= FPS_DROP_DURATION) {
          newState.isDegraded = true;
          newState.isReduced = true;
          lowFpsStartRef.current = null;
          onDegrade?.();
        }
      } else if (smoothedFps >= FPS_LOW_THRESHOLD) {
        // Reset low FPS tracking if FPS is acceptable
        lowFpsStartRef.current = null;
      }

      // Check for recovery
      if (smoothedFps > FPS_RECOVERY_THRESHOLD && prev.isReduced) {
        // Start tracking high FPS duration if not already
        if (highFpsStartRef.current === null) {
          highFpsStartRef.current = now;
        }

        // Check if we've been above threshold for long enough
        const highDuration = now - highFpsStartRef.current;
        if (highDuration >= FPS_RECOVERY_DURATION) {
          newState.isDegraded = false;
          newState.isReduced = false;
          highFpsStartRef.current = null;
          onRecover?.();
        }
      } else if (smoothedFps <= FPS_RECOVERY_THRESHOLD) {
        // Reset high FPS tracking if FPS drops again
        highFpsStartRef.current = null;
      }

      return newState;
    });
  }, [onDegrade, onRecover]);

  // Reset the monitor state
  const reset = useCallback(() => {
    setState({
      fps: 60,
      isDegraded: false,
      isReduced: false,
    });
    fpsHistoryRef.current = [];
    lowFpsStartRef.current = null;
    highFpsStartRef.current = null;
    lastFrameTimeRef.current = performance.now();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fpsHistoryRef.current = [];
    };
  }, []);

  return {
    ...state,
    recordFrame,
    reset,
  };
}
