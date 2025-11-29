"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Color, Vector3 } from "three";
import {
  ParticleData,
  ANIMATION_PARAMS,
  CANVAS_SETTINGS,
} from "./particle-config";

// ============================================================================
// TYPES
// ============================================================================

export interface ParticleProps {
  data: ParticleData;
  /** Current theme for color selection */
  isDarkMode: boolean;
  /** Whether to animate (false for reduced motion) */
  animate: boolean;
  /** Mouse position in world space (null if mouse not over canvas) */
  mousePosition: Vector3 | null;
  /** Opacity for fade in/out effects */
  opacity: number;
  /** Primary color for this theme */
  primaryColor: string;
  /** Secondary color for this theme */
  secondaryColor: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Individual particle component (icosahedron or torus knot).
 * Handles its own animation, mouse reactivity, and theme transitions.
 */
export function Particle({
  data,
  isDarkMode,
  animate,
  mousePosition,
  opacity,
  primaryColor,
  secondaryColor,
}: ParticleProps) {
  const meshRef = useRef<Mesh>(null);
  const basePositionRef = useRef(new Vector3(...data.position));
  const currentOffsetRef = useRef(new Vector3(0, 0, 0));
  const colorRef = useRef(new Color());
  const targetColorRef = useRef(new Color());
  const transitionStartRef = useRef<number | null>(null);

  // Determine color based on particle type
  const targetColor = useMemo(() => {
    return data.type === "icosahedron" ? primaryColor : secondaryColor;
  }, [data.type, primaryColor, secondaryColor]);

  // Update target color when theme changes
  useMemo(() => {
    targetColorRef.current.set(targetColor);
    transitionStartRef.current = performance.now();
  }, [targetColor, isDarkMode]);

  // Animation frame update
  useFrame((state) => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;

    // Color transition (always happens, even with reduced motion)
    if (transitionStartRef.current !== null) {
      const elapsed = performance.now() - transitionStartRef.current;
      const delay = data.themeTransitionDelay;
      const effectiveElapsed = Math.max(0, elapsed - delay);
      const progress = Math.min(
        1,
        effectiveElapsed / ANIMATION_PARAMS.themeTransitionDuration
      );

      // Ease-in-out interpolation
      const easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      colorRef.current.lerp(targetColorRef.current, easedProgress);

      // Access material color safely
      if (
        mesh.material &&
        "color" in mesh.material &&
        mesh.material.color instanceof Color
      ) {
        mesh.material.color.copy(colorRef.current);
      }

      if (progress >= 1) {
        transitionStartRef.current = null;
      }
    }

    // Opacity update
    if (mesh.material && "opacity" in mesh.material) {
      mesh.material.opacity = opacity;
    }

    // Skip movement animations if reduced motion is enabled
    if (!animate) return;

    // Drift animation
    const drift = data.driftSpeed;
    basePositionRef.current.x += data.driftDirection[0] * drift;
    basePositionRef.current.y += data.driftDirection[1] * drift;
    basePositionRef.current.z += data.driftDirection[2] * drift;

    // Wrap around bounds
    const range = CANVAS_SETTINGS.spawnRange;
    if (basePositionRef.current.x > range) basePositionRef.current.x = -range;
    if (basePositionRef.current.x < -range) basePositionRef.current.x = range;
    if (basePositionRef.current.y > range) basePositionRef.current.y = -range;
    if (basePositionRef.current.y < -range) basePositionRef.current.y = range;
    if (basePositionRef.current.z > range / 2)
      basePositionRef.current.z = -range / 2;
    if (basePositionRef.current.z < -range / 2)
      basePositionRef.current.z = range / 2;

    // Rotation animation
    mesh.rotation.x += data.rotationAxis[0] * data.rotationSpeed;
    mesh.rotation.y += data.rotationAxis[1] * data.rotationSpeed;
    mesh.rotation.z += data.rotationAxis[2] * data.rotationSpeed;

    // Mouse repulsion
    if (mousePosition) {
      const distance = basePositionRef.current.distanceTo(mousePosition);

      if (distance < ANIMATION_PARAMS.mouseInfluenceRadius) {
        // Calculate repulsion direction
        const repulseDir = basePositionRef.current
          .clone()
          .sub(mousePosition)
          .normalize();

        // Strength decreases with distance (inverse linear)
        const strength =
          (1 - distance / ANIMATION_PARAMS.mouseInfluenceRadius) *
          ANIMATION_PARAMS.mouseRepelStrength;

        // Apply smooth offset (lerp for smooth movement)
        currentOffsetRef.current.lerp(
          repulseDir.multiplyScalar(strength),
          0.1
        );
      } else {
        // Gradually return to base position
        currentOffsetRef.current.lerp(new Vector3(0, 0, 0), 0.05);
      }
    } else {
      // No mouse, return to base position
      currentOffsetRef.current.lerp(new Vector3(0, 0, 0), 0.05);
    }

    // Apply final position
    mesh.position.copy(basePositionRef.current).add(currentOffsetRef.current);
  });

  // Initialize color on mount
  useMemo(() => {
    colorRef.current.set(targetColor);
  }, []);

  // Render geometry based on type
  return (
    <mesh
      ref={meshRef}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
    >
      {data.type === "icosahedron" ? (
        <icosahedronGeometry args={[1, 0]} />
      ) : (
        <torusKnotGeometry args={[0.5, 0.2, 64, 8]} />
      )}
      <meshStandardMaterial
        color={targetColor}
        transparent
        opacity={opacity}
        emissive={targetColor}
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
