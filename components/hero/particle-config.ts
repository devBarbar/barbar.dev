/**
 * Particle configuration constants for 3D Hero Section
 * Based on spec: .specs/barbar-dev-portfolio/004-3d-hero-section.md
 */

// ============================================================================
// PARTICLE COUNTS
// ============================================================================

/** Desktop particle count (viewport >= 1024px) */
export const PARTICLE_COUNT_DESKTOP = 100;

/** Tablet particle count (viewport 640-1023px) */
export const PARTICLE_COUNT_TABLET = 75;

/** Mobile particle count (viewport < 640px) */
export const PARTICLE_COUNT_MOBILE = 50;

// ============================================================================
// PARTICLE GEOMETRY RATIOS
// ============================================================================

/** Ratio of icosahedron particles (60% of total) */
export const ICOSAHEDRON_RATIO = 0.6;

/** Ratio of torus knot particles (40% of total) */
export const TORUS_KNOT_RATIO = 0.4;

// ============================================================================
// PARTICLE SIZE RANGES
// ============================================================================

export const PARTICLE_SIZES = {
  icosahedron: {
    min: 0.3,
    max: 0.8,
  },
  torusKnot: {
    min: 0.2,
    max: 0.5,
  },
} as const;

// ============================================================================
// BLOOM/GLOW SETTINGS
// ============================================================================

export const BLOOM_SETTINGS = {
  dark: {
    enabled: true,
    intensity: 1.5,
    radius: 0.8,
    threshold: 0.2,
  },
  light: {
    enabled: true,
    intensity: 0.8,
    radius: 0.5,
    threshold: 0.4,
  },
  mobile: {
    enabled: false,
    intensity: 0,
    radius: 0,
    threshold: 0,
  },
  /** Chrome desktop has severe paint performance issues with bloom - disable */
  chromeDesktop: {
    enabled: false,
    intensity: 0,
    radius: 0,
    threshold: 0,
  },
} as const;

// ============================================================================
// ANIMATION PARAMETERS
// ============================================================================

export const ANIMATION_PARAMS = {
  /** Minimum drift speed (units per frame) */
  driftSpeedMin: 0.001,
  /** Maximum drift speed (units per frame) */
  driftSpeedMax: 0.003,

  /** Minimum rotation speed (radians per frame) */
  rotationSpeedMin: 0.002,
  /** Maximum rotation speed (radians per frame) */
  rotationSpeedMax: 0.005,

  /** Radius within which particles react to mouse (units) */
  mouseInfluenceRadius: 3,

  /** How far particles are pushed from mouse (units) */
  mouseRepelStrength: 0.5,

  /** Duration of touch ripple effect (ms) */
  touchRippleDuration: 600,

  /** Duration of theme color transition (ms) */
  themeTransitionDuration: 1000,

  /** Maximum random delay for staggered theme transition (ms) */
  themeTransitionMaxDelay: 500,

  /** Maximum delta time (seconds) to prevent large animation jumps after frame drops */
  maxDeltaTime: 0.1,
} as const;

// ============================================================================
// CANVAS SETTINGS
// ============================================================================

export const CANVAS_SETTINGS = {
  /** Max time to wait for canvas to be ready before fallback (ms) */
  loadingTimeout: 2000,

  /** Duration of loading shimmer fade-out (ms) */
  shimmerFadeOutDuration: 300,

  /** Duration of particles fade-in (ms) */
  particlesFadeInDuration: 500,

  /** Camera field of view */
  cameraFov: 75,

  /** Camera near clipping plane */
  cameraNear: 0.1,

  /** Camera far clipping plane */
  cameraFar: 1000,

  /** Camera Z position */
  cameraPosition: 5,

  /** Particle spawn range (units from center) */
  spawnRange: 8,

  /** 
   * Frameloop mode: 'demand' renders only when needed (invalidate() called)
   * This prevents the uncapped frame loop that was causing Chrome desktop lag
   */
  frameloop: "demand" as const,

  /** Minimum device pixel ratio (prevents excessive GPU work) */
  dprMin: 1,

  /** Maximum device pixel ratio (prevents excessive GPU work on high-DPI screens) */
  dprMax: 2,

  /** WebGL power preference for optimal performance */
  powerPreference: "high-performance" as const,
} as const;

// ============================================================================
// PERFORMANCE SETTINGS
// ============================================================================

export const PERFORMANCE_SETTINGS = {
  /** Use refs instead of state for mouse position tracking to avoid re-renders */
  useMouseRef: true,

  /** Throttle FPS state updates to avoid React reconciliation spam */
  throttleStateUpdates: true,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the appropriate particle count based on viewport/device type
 */
export function getParticleCount(isMobile: boolean, isTablet: boolean): number {
  if (isMobile) return PARTICLE_COUNT_MOBILE;
  if (isTablet) return PARTICLE_COUNT_TABLET;
  return PARTICLE_COUNT_DESKTOP;
}

/**
 * Get random value between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate initial particle data with random positions and properties
 */
export interface ParticleData {
  id: number;
  type: "icosahedron" | "torusKnot";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  driftSpeed: number;
  rotationSpeed: number;
  driftDirection: [number, number, number];
  rotationAxis: [number, number, number];
  themeTransitionDelay: number;
}

export function generateParticles(count: number): ParticleData[] {
  const particles: ParticleData[] = [];
  const icosahedronCount = Math.floor(count * ICOSAHEDRON_RATIO);

  for (let i = 0; i < count; i++) {
    const isIcosahedron = i < icosahedronCount;
    const type = isIcosahedron ? "icosahedron" : "torusKnot";
    const sizeRange = PARTICLE_SIZES[type];

    // Random position within spawn range
    const position: [number, number, number] = [
      randomBetween(-CANVAS_SETTINGS.spawnRange, CANVAS_SETTINGS.spawnRange),
      randomBetween(-CANVAS_SETTINGS.spawnRange, CANVAS_SETTINGS.spawnRange),
      randomBetween(
        -CANVAS_SETTINGS.spawnRange / 2,
        CANVAS_SETTINGS.spawnRange / 2
      ),
    ];

    // Random initial rotation
    const rotation: [number, number, number] = [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];

    // Random scale within size range
    const scale = randomBetween(sizeRange.min, sizeRange.max);

    // Random drift direction (normalized)
    const driftDir: [number, number, number] = [
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ];
    const driftMagnitude = Math.sqrt(
      driftDir[0] ** 2 + driftDir[1] ** 2 + driftDir[2] ** 2
    );
    const driftDirection: [number, number, number] = [
      driftDir[0] / driftMagnitude,
      driftDir[1] / driftMagnitude,
      driftDir[2] / driftMagnitude,
    ];

    // Random rotation axis (normalized)
    const rotAxis: [number, number, number] = [
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ];
    const rotMagnitude = Math.sqrt(
      rotAxis[0] ** 2 + rotAxis[1] ** 2 + rotAxis[2] ** 2
    );
    const rotationAxis: [number, number, number] = [
      rotAxis[0] / rotMagnitude,
      rotAxis[1] / rotMagnitude,
      rotAxis[2] / rotMagnitude,
    ];

    particles.push({
      id: i,
      type,
      position,
      rotation,
      scale,
      driftSpeed: randomBetween(
        ANIMATION_PARAMS.driftSpeedMin,
        ANIMATION_PARAMS.driftSpeedMax
      ),
      rotationSpeed: randomBetween(
        ANIMATION_PARAMS.rotationSpeedMin,
        ANIMATION_PARAMS.rotationSpeedMax
      ),
      driftDirection,
      rotationAxis,
      themeTransitionDelay:
        Math.random() * ANIMATION_PARAMS.themeTransitionMaxDelay,
    });
  }

  return particles;
}
