"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
// MOUSE TRACKER COMPONENT
// ============================================================================

interface MouseTrackerProps {
  onMouseMove: (position: Vector3 | null) => void;
}

function MouseTracker({ onMouseMove }: MouseTrackerProps) {
  const { camera, size } = useThree();
  const mouseRef = useRef(new Vector3());

  useFrame((state) => {
    // Convert pointer to world position at z=0
    const pointer = state.pointer;
    mouseRef.current.set(
      (pointer.x * size.width) / 100,
      (pointer.y * size.height) / 100,
      0
    );
    mouseRef.current.unproject(camera);
    onMouseMove(mouseRef.current.clone());
  });

  return null;
}

// ============================================================================
// FPS MONITOR COMPONENT
// ============================================================================

interface FpsMonitorComponentProps {
  onDegrade: () => void;
  onRecover: () => void;
}

function FpsMonitorComponent({
  onDegrade,
  onRecover,
}: FpsMonitorComponentProps) {
  const { recordFrame } = useFpsMonitor(onDegrade, onRecover);

  useFrame(() => {
    recordFrame();
  });

  return null;
}

// ============================================================================
// PARTICLES CONTAINER
// ============================================================================

interface ParticlesContainerProps {
  particles: ParticleData[];
  isDarkMode: boolean;
  animate: boolean;
  mousePosition: Vector3 | null;
  particleOpacity: number;
  primaryColor: string;
  secondaryColor: string;
}

function ParticlesContainer({
  particles,
  isDarkMode,
  animate,
  mousePosition,
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
          mousePosition={mousePosition}
          opacity={particleOpacity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </>
  );
}

// ============================================================================
// MAIN SCENE COMPONENT
// ============================================================================

export function ParticlesScene({ onReady, onError }: ParticlesSceneProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const deviceType = useDeviceType();
  const colors = useParticleColors();
  const prefersReducedMotion = useReducedMotion();

  // State
  const [isReady, setIsReady] = useState(false);
  const [mousePosition, setMousePosition] = useState<Vector3 | null>(null);
  const [isReduced, setIsReduced] = useState(false);
  const [particleOpacity, setParticleOpacity] = useState(0);

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

  // Handle mouse tracking
  const handleMouseMove = useCallback((position: Vector3 | null) => {
    setMousePosition(position);
  }, []);

  // Clear mouse position when not hovering
  const handlePointerLeave = useCallback(() => {
    setMousePosition(null);
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

  // Get bloom settings based on theme and device
  const bloomSettings = useMemo(() => {
    if (deviceType === "mobile" || deviceType === "tablet") {
      return BLOOM_SETTINGS.mobile;
    }
    return isDarkMode ? BLOOM_SETTINGS.dark : BLOOM_SETTINGS.light;
  }, [deviceType, isDarkMode]);

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
      onPointerLeave={handlePointerLeave}
      onError={(error) => onError?.(new Error(String(error)))}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      aria-hidden="true"
      role="img"
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Mouse tracking */}
      <MouseTracker onMouseMove={handleMouseMove} />

      {/* FPS monitoring (only on desktop) */}
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
        mousePosition={prefersReducedMotion ? null : mousePosition}
        particleOpacity={particleOpacity}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
      />

      {/* Post-processing effects (bloom) */}
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
