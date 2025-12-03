# 🐛 Bug: Production 3D Hero Causes Severe Page Lag on Chrome Desktop

| Metadata | Details |
| :--- | :--- |
| **Status** | `READY FOR QA` |
| **Priority** | P0 - Critical |
| **Severity** | Blocker |
| **Reported By** | Barbar Ahmad |
| **Date** | 2025-12-03 |

## 1. Description

The deployed production site (barbar.dev) experiences severe performance lag on Chrome desktop browsers. The entire browser becomes unresponsive, the custom cursor lags significantly, and frame rates drop to unusable levels. This does not occur locally or on mobile Safari.

## 2. Steps to Reproduce (STR)

1. Deploy the site to Vercel production
2. Open https://barbar.dev in Chrome on Windows 11 desktop
3. Observe immediate page lag
4. Move mouse around - cursor stutters/lags
5. Entire browser becomes sluggish

## 3. Expected vs. Actual

* **Expected Behavior:** Smooth 60fps experience with responsive cursor and animations
* **Actual Behavior:** Severe lag, dropped frames (883ms+ per frame), 5+ seconds of painting time, unresponsive browser

## 4. Environment & Context

* **URL:** https://barbar.dev (homepage)
* **Device/OS:** Windows 11 Desktop (powerful machine)
* **Browser:** Chrome (latest)
* **Works on:** Local dev, Mobile Safari
* **Broken on:** Chrome desktop (Vercel production)

## 5. Evidence (Logs & Visuals)

* **Console Errors:** None
* **Chrome DevTools Performance Trace:**
  - **Painting: 5,227 ms** (46% of total!) 🔴
  - **Scripting: 407 ms**
  - **Rendering: 184 ms**
  - **Total: 11,257 ms** for ~11 seconds
  - **Frames:** Constant red/dropped frames (single frame taking 883ms+)
  - **GPU row:** Continuous heavy GPU work
  - **"unattributed":** 5,632.9 ms main thread time

## 6. Root Cause Hypothesis

Based on code analysis of `particles-scene.tsx`, `hero-canvas.tsx`, and `use-fps-monitor.ts`:

### Primary Issues:

1. **Uncapped Frame Loop**
   - `<Canvas>` has no `frameloop` prop - defaults to `"always"` (max refresh rate)
   - Production builds may run hotter than dev builds
   - Should use `frameloop="demand"` or cap to 60fps

2. **Expensive Post-Processing (Bloom)**
   - `<EffectComposer>` with `<Bloom>` runs on EVERY frame
   - Chrome's WebGL implementation handles this differently than Safari
   - Bloom is enabled even on desktop with `BLOOM_SETTINGS.dark/light`

3. **React State Updates in Animation Loop**
   - `FpsMonitorComponent` calls `setState()` via `recordFrame()` on every frame
   - This triggers React reconciliation ~60+ times/second
   - Production React may batch differently than dev mode

4. **MouseTracker Updates Every Frame**
   - `handleMouseMove` callback updates state on every `useFrame`
   - Creates continuous re-renders of `ParticlesContainer`

### Why It Works Locally But Not Production:

- React dev mode has different batching/reconciliation behavior
- Production builds are more aggressive with optimizations that may expose race conditions
- Vercel's edge network may introduce latency that compounds rendering issues
- Chrome's compositor thread behaves differently with production-minified code

## 7. Possible Fix / Workaround

### Immediate Fixes:

```tsx
// 1. Cap framerate in Canvas
<Canvas
  frameloop="demand" // or use a custom frame limiter
  // ... other props
>

// 2. Disable or simplify Bloom on desktop Chrome
// Add browser detection and disable EffectComposer

// 3. Throttle FPS monitor state updates
// Only update state every 500ms, not every frame
const recordFrame = useCallback(() => {
  // ... FPS calculation ...
  // Only setState periodically, not every frame
  if (now - lastStateUpdateRef.current > 500) {
    setState(newState);
    lastStateUpdateRef.current = now;
  }
}, []);

// 4. Memoize mouse position updates
// Use a ref instead of state for mouse position
const mousePositionRef = useRef<Vector3 | null>(null);
// Only pass to children that need it via context
```

### Long-term Fixes:

1. Implement proper frame capping (target 30fps for effects, 60fps for UI)
2. Add device/browser detection to disable Bloom on Chrome desktop
3. Use `requestAnimationFrame` throttling pattern
4. Move mouse tracking to a ref, not state
5. Consider using `drei`'s `<PerformanceMonitor>` instead of custom FPS hook
6. Add `dpr` (device pixel ratio) limiting: `dpr={[1, 1.5]}`

### Quick Test:

Temporarily disable the 3D hero entirely to confirm it's the source:
```tsx
// In hero-canvas.tsx, return early:
export function HeroCanvas({ className }: HeroCanvasProps) {
  return null; // Temporary - confirm this fixes the lag
}
```

---

## Related Files

- [particles-scene.tsx](../components/hero/particles-scene.tsx)
- [hero-canvas.tsx](../components/hero/hero-canvas.tsx)
- [use-fps-monitor.ts](../hooks/use-fps-monitor.ts)
- [particle-config.ts](../components/hero/particle-config.ts)

---

## 8. Fix Applied (2025-12-03)

### Summary of Changes

The following performance optimizations were implemented to resolve the Chrome desktop lag:

#### 1. Canvas Frameloop Changed to "demand" Mode
**File:** [particle-config.ts](../components/hero/particle-config.ts)
- Changed from default "always" (uncapped) to "demand" frameloop
- Canvas now only re-renders when `invalidate()` is called
- Prevents runaway GPU usage in production builds

#### 2. Device Pixel Ratio (DPR) Limited
**File:** [particle-config.ts](../components/hero/particle-config.ts)
- Added `dprMin: 1` and `dprMax: 2` limits
- Prevents excessive GPU work on high-DPI displays

#### 3. Bloom Disabled on Chrome Desktop
**File:** [particle-config.ts](../components/hero/particle-config.ts)
- Added `BLOOM_SETTINGS.chromeDesktop` with `enabled: false`
- Chrome's WebGL has severe paint performance issues with post-processing effects

#### 4. FPS Monitor State Updates Throttled
**File:** [use-fps-monitor.ts](../hooks/use-fps-monitor.ts)
- Added `FPS_STATE_UPDATE_INTERVAL = 500ms` throttle
- Prevents React reconciliation spam (was updating state 60+ times/second)
- Uses refs internally for FPS tracking, only updates state periodically

#### 5. Mouse Tracking Uses Refs Instead of State
**File:** [particles-scene.tsx](../components/hero/particles-scene.tsx)
- Changed `MouseTracker` to update a ref instead of calling setState
- Eliminates re-renders on every mouse move

#### 6. Browser Detection for Targeted Optimizations
**File:** [lib/utils.ts](../lib/utils.ts)
- Added `detectBrowser()` utility function
- Detects Chrome, Safari, Firefox, and device type
- Used to conditionally disable bloom on Chrome desktop

#### 7. Animation Delta Time Capped
**File:** [particle-config.ts](../components/hero/particle-config.ts)
- Added `ANIMATION_PARAMS.maxDeltaTime = 0.1` (100ms)
- Prevents large animation jumps after frame drops

### Test Coverage

New test file: [hero-performance.test.tsx](../__tests__/hero-performance.test.tsx)
- 11 new tests covering all performance optimizations
- All 167 tests pass (including existing tests)
