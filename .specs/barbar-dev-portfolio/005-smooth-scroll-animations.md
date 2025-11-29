**Status:** READY FOR QA
**Date:** 2025-11-29
**Updated:** 2025-11-30

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |

## Title
Smooth Scroll & Section Animations

## Description
**User Story:**
As a visitor, I want smooth scrolling between sections with animated reveals, so that the browsing experience feels polished and professional.

**Context:**
Implement Lenis for smooth scrolling combined with Framer Motion for scroll-triggered animations. Each section should animate in as it enters the viewport. Smooth scroll behavior for anchor navigation on the single-page homepage.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Sections animate on scroll
  Given I am scrolling down the homepage
  When a new section enters the viewport (10-20% visible)
  Then it animates in smoothly with its unique animation style

Scenario: Hero section animates on initial load
  Given the page first loads
  When the hero section is in view
  Then the hero content fades in on page mount

Scenario: Smooth scroll to anchors
  Given I click a navigation link to #projects
  When Lenis handles the scroll
  Then it scrolls smoothly to the projects section

Scenario: Animations respect reduced motion
  Given my OS has "reduce motion" enabled
  When sections enter the viewport
  Then animations are disabled or minimal (instant state)

Scenario: Animation timing is consistent
  Given I am scrolling through the page
  When each section animates
  Then the animation duration is 300ms with consistent easing

Scenario: Child elements stagger animate
  Given a section enters the viewport
  When the section animates in
  Then child elements (heading, cards, etc.) animate with staggered delays

Scenario: Animations replay on scroll-up
  Given I have scrolled past a section (animation played)
  When I scroll back up and the section re-enters viewport
  Then the animation replays
```

---

## Technical Specification

### Dependencies
| Package | Purpose | Install Command |
|:--------|:--------|:----------------|
| `lenis` | Smooth scroll library | `pnpm add lenis` |
| `framer-motion` | Scroll-triggered animations | Already installed ✅ |

### Architecture

#### 1. Lenis Provider (`components/lenis-provider.tsx`)
- Client component wrapping the app with Lenis smooth scroll
- Integrates with Framer Motion's `useScroll` via RAF sync
- Respects `prefers-reduced-motion` (disable smooth scroll if enabled)
- Handles anchor link clicks for smooth scrolling to sections

#### 2. Animated Section Wrapper (`components/animated-section.tsx`)
- Reusable `<AnimatedSection>` component using Framer Motion
- Props:
  - `animation`: Animation type (see section mapping below)
  - `delay`: Optional stagger delay for the section itself
  - `staggerChildren`: Enable staggered child animations
  - `staggerDelay`: Delay between child animations (default: 0.1s)
- Uses `whileInView` with `amount: 0.15` (triggers at ~15% visible)
- Uses `viewport={{ once: false }}` for replay on scroll-up

#### 3. Section Animation Mapping
| Section | Animation | Description |
|:--------|:----------|:------------|
| **Hero** | `fadeIn` | Fade in on page load (not scroll-triggered) |
| **Projects** | `slideUp` | Slide up from bottom with fade |
| **About/CV** | `slideLeft` | Slide in from left with fade |
| **Contact** | `scale` | Scale up from 0.95 with fade |
| **Blog Listing** | `slideUp` | Slide up from bottom with fade |

#### 4. Animation Variants
```typescript
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
};
```

#### 5. Animation Timing
| Property | Value |
|:---------|:------|
| Duration | 300ms (`0.3s`) |
| Easing | `easeOut` or `[0.25, 0.1, 0.25, 1]` |
| Viewport Threshold | `amount: 0.15` (10-20% visible) |
| Stagger Delay (children) | 100ms (`0.1s`) between each child |

### Implementation Checklist
- [ ] Install `lenis` package
- [ ] Create `LenisProvider` component in `/components/lenis-provider.tsx`
- [ ] Wrap app with `LenisProvider` in `layout.tsx`
- [ ] Create `AnimatedSection` component in `/components/animated-section.tsx`
- [ ] Update `hero-section.tsx` to use fade-in animation on mount
- [ ] Update `page.tsx` to wrap sections with `AnimatedSection`
- [ ] Add reduced motion handling (use `useReducedMotion` hook)
- [ ] Test anchor link smooth scrolling
- [ ] Test animation replay on scroll-up

### Integration with Existing Code
- **`useReducedMotion` hook** ([hooks/use-reduced-motion.ts](hooks/use-reduced-motion.ts)): Reuse for disabling animations
- **Hero CTA button** ([components/hero/hero-section.tsx#L74](components/hero/hero-section.tsx#L74)): Will work with Lenis automatically via anchor href
- **Theme transitions** ([app/globals.css#L132](app/globals.css#L132)): Scroll animations are separate from theme transitions

### Reduced Motion Behavior
When `prefers-reduced-motion: reduce` is enabled:
- Lenis smooth scroll is disabled (native scroll behavior)
- Framer Motion animations have `duration: 0` (instant state change)
- Sections appear in final state without animation

---

## QA Testing Strategy

### 1. Manual Verification (Happy Path)
- [ ] **TC-001:** Scroll down homepage → Verify each section animates in as it enters viewport
- [ ] **TC-002:** Verify Hero section fades in on initial page load
- [ ] **TC-003:** Click CTA button "View My Work" → Verify smooth scroll to #projects via Lenis
- [ ] **TC-004:** Verify Projects section slides up with fade
- [ ] **TC-005:** Verify child elements (cards, headings) stagger animate within sections
- [ ] **TC-006:** Scroll past a section, then scroll back up → Verify animation replays
- [ ] **TC-007:** Verify all animations complete in ~300ms

### 2. Edge Cases & Destructive Testing
- [ ] **TC-008:** Enable "Reduce Motion" in OS → Verify animations are instant (no motion)
- [ ] **TC-009:** Enable "Reduce Motion" → Verify Lenis smooth scroll is disabled
- [ ] **TC-010:** Rapid scroll up/down → Verify no animation glitches or overlapping
- [ ] **TC-011:** Click anchor link while mid-scroll → Verify scroll redirects correctly
- [ ] **TC-012:** Hard refresh (Ctrl+Shift+R) → Verify no hydration errors
- [ ] **TC-013:** Resize window during scroll → Verify animations still work

### 3. Performance
- [ ] **TC-014:** Run Lighthouse → Verify Performance score > 80
- [ ] **TC-015:** Verify Lenis does not cause jank (60fps scroll)
- [ ] **TC-016:** Verify animations don't block main thread

### 4. Cross-Browser
- [ ] **TC-017:** Test in Chrome, Firefox, Safari (desktop)
- [ ] **TC-018:** Test on iOS Safari and Android Chrome (mobile)
