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

/** 
 * Minimum interval (ms) between state updates to prevent React reconciliation spam
 * This is critical for Chrome desktop performance - updating state every frame
 * causes severe lag in production builds
 */
export const FPS_STATE_UPDATE_INTERVAL = 500;

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
  /** Get current FPS without triggering state update (for ref-based access) */
  getCurrentFps: () => number;
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
 * Performance optimization:
 * - State updates are throttled to FPS_STATE_UPDATE_INTERVAL (500ms)
 * - FPS calculation uses refs internally to avoid re-renders
 * - getCurrentFps() provides ref-based access without state updates
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

  // Refs for timing calculations (avoids state updates on every frame)
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const lowFpsStartRef = useRef<number | null>(null);
  const highFpsStartRef = useRef<number | null>(null);
  const lastStateUpdateRef = useRef<number>(performance.now());
  
  // Internal refs to track current values without state updates
  const currentFpsRef = useRef<number>(60);
  const isReducedRef = useRef<boolean>(false);
  const isDegradedRef = useRef<boolean>(false);

  // Get current FPS without triggering state update
  const getCurrentFps = useCallback(() => {
    return currentFpsRef.current;
  }, []);

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
    
    // Update internal ref (always, for getCurrentFps())
    currentFpsRef.current = Math.round(smoothedFps);

    // Check for performance degradation/recovery using refs (not state)
    let shouldTriggerDegrade = false;
    let shouldTriggerRecover = false;

    // Check for degraded performance
    if (smoothedFps < FPS_LOW_THRESHOLD && !isReducedRef.current) {
      // Start tracking low FPS duration if not already
      if (lowFpsStartRef.current === null) {
        lowFpsStartRef.current = now;
      }

      // Check if we've been below threshold for long enough
      const lowDuration = now - lowFpsStartRef.current;
      if (lowDuration >= FPS_DROP_DURATION) {
        isDegradedRef.current = true;
        isReducedRef.current = true;
        lowFpsStartRef.current = null;
        shouldTriggerDegrade = true;
      }
    } else if (smoothedFps >= FPS_LOW_THRESHOLD) {
      // Reset low FPS tracking if FPS is acceptable
      lowFpsStartRef.current = null;
    }

    // Check for recovery
    if (smoothedFps > FPS_RECOVERY_THRESHOLD && isReducedRef.current) {
      // Start tracking high FPS duration if not already
      if (highFpsStartRef.current === null) {
        highFpsStartRef.current = now;
      }

      // Check if we've been above threshold for long enough
      const highDuration = now - highFpsStartRef.current;
      if (highDuration >= FPS_RECOVERY_DURATION) {
        isDegradedRef.current = false;
        isReducedRef.current = false;
        highFpsStartRef.current = null;
        shouldTriggerRecover = true;
      }
    } else if (smoothedFps <= FPS_RECOVERY_THRESHOLD) {
      // Reset high FPS tracking if FPS drops again
      highFpsStartRef.current = null;
    }

    // Throttle state updates to prevent React reconciliation spam
    // Only update state if:
    // 1. Enough time has passed since last update, OR
    // 2. We need to trigger a degrade/recover callback
    const timeSinceLastUpdate = now - lastStateUpdateRef.current;
    const shouldUpdateState = 
      timeSinceLastUpdate >= FPS_STATE_UPDATE_INTERVAL ||
      shouldTriggerDegrade ||
      shouldTriggerRecover;

    if (shouldUpdateState) {
      lastStateUpdateRef.current = now;
      setState({
        fps: currentFpsRef.current,
        isDegraded: isDegradedRef.current,
        isReduced: isReducedRef.current,
      });

      // Fire callbacks after state update
      if (shouldTriggerDegrade) {
        onDegrade?.();
      }
      if (shouldTriggerRecover) {
        onRecover?.();
      }
    }
  }, [onDegrade, onRecover]);

  // Reset the monitor state
  const reset = useCallback(() => {
    setState({
      fps: 60,
      isDegraded: false,
      isReduced: false,
    });
    currentFpsRef.current = 60;
    isDegradedRef.current = false;
    isReducedRef.current = false;
    fpsHistoryRef.current = [];
    lowFpsStartRef.current = null;
    highFpsStartRef.current = null;
    lastFrameTimeRef.current = performance.now();
    lastStateUpdateRef.current = performance.now();
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
    getCurrentFps,
  };
}
