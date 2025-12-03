"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Vector3 } from "three";
import { useTheme } from "next-themes";
import { Particle } from "./particle";
import {
  generateParticles,
  getParticleCount,
  BLOOM_SETTINGS,
  CANVAS_SETTINGS,
  ParticleData,
} from "./particle-config";
import { useFpsMonitor } from "@/hooks/use-fps-monitor";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { detectBrowser } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface ParticlesSceneProps {
  /** Called when canvas is ready */
  onReady?: () => void;
  /** Called when there's an error */
  onError?: (error: Error) => void;
}

// ============================================================================
// DEVICE DETECTION HOOK
// ============================================================================

function useDeviceType() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDevice("mobile");
      } else if (width < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return device;
}

// ============================================================================
// THEME COLORS HOOK
// ============================================================================

function useParticleColors() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState({
    primary: "#6366f1",
    secondary: "#22d3ee",
    glow: "#f59e0b",
  });

  useEffect(() => {
    // Read CSS variables from the document
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const primary =
      computedStyle.getPropertyValue("--particle-primary").trim() || "#6366f1";
    const secondary =
      computedStyle.getPropertyValue("--particle-secondary").trim() ||
      "#22d3ee";
    const glow =
      computedStyle.getPropertyValue("--particle-glow").trim() || "#f59e0b";

    setColors({ primary, secondary, glow });
  }, [resolvedTheme]);

  return colors;
}

// ============================================================================
// MOUSE TRACKER COMPONENT (Performance Optimized)
// ============================================================================

interface MouseTrackerProps {
  /** Ref to update mouse position (avoids state updates on every frame) */
  mousePositionRef: React.MutableRefObject<Vector3 | null>;
}

/**
 * Tracks mouse position in 3D space.
 * Uses refs instead of state callbacks to avoid triggering re-renders.
 * Calls invalidate() to trigger re-render only when needed (demand frameloop).
 */
function MouseTracker({ mousePositionRef }: MouseTrackerProps) {
  const { camera, size } = useThree();
  const localMouseRef = useRef(new Vector3());

  useFrame((state) => {
    // Convert pointer to world position at z=0
    const pointer = state.pointer;
    localMouseRef.current.set(
      (pointer.x * size.width) / 100,
      (pointer.y * size.height) / 100,
      0
    );
    localMouseRef.current.unproject(camera);
    
    // Update the shared ref (no state update, no re-render)
    mousePositionRef.current = localMouseRef.current.clone();
    
    // Invalidate to trigger re-render (since we use frameloop="demand")
    invalidate();
  });

  return null;
}

// ============================================================================
// FPS MONITOR COMPONENT (Performance Optimized)
// ============================================================================

interface FpsMonitorComponentProps {
  onDegrade: () => void;
  onRecover: () => void;
}

/**
 * Monitors FPS within the R3F context.
 * Uses throttled state updates via useFpsMonitor hook.
 * Calls invalidate() to ensure continuous frame recording.
 */
function FpsMonitorComponent({
  onDegrade,
  onRecover,
}: FpsMonitorComponentProps) {
  const { recordFrame } = useFpsMonitor(onDegrade, onRecover);

  useFrame(() => {
    recordFrame();
    // Invalidate to keep the animation loop going (since we use frameloop="demand")
    invalidate();
  });

  return null;
}

// ============================================================================
// PARTICLES CONTAINER (Performance Optimized)
// ============================================================================

interface ParticlesContainerProps {
  particles: ParticleData[];
  isDarkMode: boolean;
  animate: boolean;
  /** Ref-based mouse position (avoids re-renders on mouse move) */
  mousePositionRef: React.MutableRefObject<Vector3 | null>;
  particleOpacity: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Container for all particle meshes.
 * Uses ref-based mouse tracking to avoid re-renders.
 */
function ParticlesContainer({
  particles,
  isDarkMode,
  animate,
  mousePositionRef,
  particleOpacity,
  primaryColor,
  secondaryColor,
}: ParticlesContainerProps) {
  return (
    <>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          data={particle}
          isDarkMode={isDarkMode}
          animate={animate}
          mousePosition={mousePositionRef.current}
          opacity={particleOpacity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </>
  );
}

// ============================================================================
// MAIN SCENE COMPONENT (Performance Optimized)
// ============================================================================

export function ParticlesScene({ onReady, onError }: ParticlesSceneProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const deviceType = useDeviceType();
  const colors = useParticleColors();
  const prefersReducedMotion = useReducedMotion();

  // State
  const [isReady, setIsReady] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const [particleOpacity, setParticleOpacity] = useState(0);
  
  // Ref-based mouse tracking (avoids state updates on every mouse move)
  const mousePositionRef = useRef<Vector3 | null>(null);
  
  // Detect browser for performance optimizations
  const browserInfo = useMemo(() => detectBrowser(), []);

  // Determine particle count based on device and performance state
  const baseCount = useMemo(() => {
    return getParticleCount(
      deviceType === "mobile",
      deviceType === "tablet"
    );
  }, [deviceType]);

  const activeCount = isReduced ? Math.floor(baseCount * 0.5) : baseCount;

  // Generate particles
  const particles = useMemo(() => {
    return generateParticles(activeCount);
  }, [activeCount]);

  // Handle performance degradation
  const handleDegrade = useCallback(() => {
    setIsReduced(true);
  }, []);

  const handleRecover = useCallback(() => {
    setIsReduced(false);
  }, []);

  // Clear mouse position when not hovering
  const handlePointerLeave = useCallback(() => {
    mousePositionRef.current = null;
  }, []);

  // Fade in particles when ready
  useEffect(() => {
    if (isReady) {
      const fadeIn = setInterval(() => {
        setParticleOpacity((prev) => {
          const next = prev + 0.02;
          if (next >= 1) {
            clearInterval(fadeIn);
            return 1;
          }
          return next;
        });
      }, CANVAS_SETTINGS.particlesFadeInDuration / 50);

      return () => clearInterval(fadeIn);
    }
  }, [isReady]);

  // Get bloom settings based on theme, device, and browser
  // Chrome desktop has severe paint performance issues with bloom - disable it
  const bloomSettings = useMemo(() => {
    if (deviceType === "mobile" || deviceType === "tablet") {
      return BLOOM_SETTINGS.mobile;
    }
    // Disable bloom on Chrome desktop due to severe paint performance issues
    if (browserInfo.isChrome && browserInfo.isDesktop) {
      return BLOOM_SETTINGS.chromeDesktop;
    }
    return isDarkMode ? BLOOM_SETTINGS.dark : BLOOM_SETTINGS.light;
  }, [deviceType, isDarkMode, browserInfo.isChrome, browserInfo.isDesktop]);

  // Notify when ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      onReady?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <Canvas
      camera={{
        fov: CANVAS_SETTINGS.cameraFov,
        near: CANVAS_SETTINGS.cameraNear,
        far: CANVAS_SETTINGS.cameraFar,
        position: [0, 0, CANVAS_SETTINGS.cameraPosition],
      }}
      // Use demand frameloop to prevent uncapped rendering
      frameloop={CANVAS_SETTINGS.frameloop}
      // Limit DPR to prevent excessive GPU work
      dpr={[CANVAS_SETTINGS.dprMin, CANVAS_SETTINGS.dprMax]}
      onPointerLeave={handlePointerLeave}
      onError={(error) => onError?.(new Error(String(error)))}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: CANVAS_SETTINGS.powerPreference,
      }}
      style={{ background: "transparent" }}
      aria-hidden="true"
      role="img"
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Mouse tracking (uses ref, not state) */}
      <MouseTracker mousePositionRef={mousePositionRef} />

      {/* FPS monitoring (only on desktop, uses throttled state updates) */}
      {deviceType === "desktop" && (
        <FpsMonitorComponent
          onDegrade={handleDegrade}
          onRecover={handleRecover}
        />
      )}

      {/* Particles */}
      <ParticlesContainer
        particles={particles}
        isDarkMode={isDarkMode}
        animate={!prefersReducedMotion}
        mousePositionRef={prefersReducedMotion ? { current: null } : mousePositionRef}
        particleOpacity={particleOpacity}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
      />

      {/* Post-processing effects (bloom) - disabled on Chrome desktop */}
      {bloomSettings.enabled && (
        <EffectComposer>
          <Bloom
            intensity={bloomSettings.intensity}
            luminanceThreshold={bloomSettings.threshold}
            luminanceSmoothing={bloomSettings.radius}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
