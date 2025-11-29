**Status:** READY FOR QA
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |

## Title
Custom Cursor Component

## Description
**User Story:**
As a desktop visitor, I want to see a custom animated cursor that reacts to interactive elements, so that the browsing experience feels premium and engaging.

**Context:**
Create a custom cursor component using Framer Motion for smooth interpolation. Must detect touch devices and gracefully degrade (not render on touch). Use CSS-only `pointer: coarse` media query for detection.

## Technical Decisions (from Q&A)

### State Management
- Use local component state with a custom `useCursor` hook in `/hooks` directory
- Follow the hydration pattern from `theme-toggle.tsx` with `mounted` state

### Interactive Element Detection
- Create a `<CursorTarget>` wrapper component for explicit opt-in
- Elements wrapped in `<CursorTarget>` will trigger cursor hover state

### Touch Device Detection
- **CSS-only approach**: Use `@media (pointer: coarse)` in `globals.css` to hide cursor via `display: none`
- Component still mounts but is visually hidden on touch devices (simpler, no JS detection needed)

### Animation
- Use Framer Motion `spring` physics for smooth cursor interpolation
- Use `requestAnimationFrame` for position updates to ensure performance

### Native Cursor
- Hide native cursor globally via CSS: `@media (pointer: fine) { body { cursor: none; } }`
- Applied in `globals.css`

### SSR/Hydration
- Use `mounted` state pattern (same as `theme-toggle.tsx`) to prevent hydration mismatch

### Visual Design
- **Shape:** Single circle element (no trail/dual pattern)
- **Default size:** 24px diameter
- **Hover size:** 48px diameter (2x scale)
- **Default color:** `--primary` theme variable
- **Hover color:** `--accent` theme variable
- **Theme integration:** Yes, cursor adapts to dark/light mode with 1s transition

### Architecture
- Render via React Portal to `document.body` to avoid z-index stacking context issues
- Use highest z-index: `z-[9999]`

### Performance
- Use `requestAnimationFrame` for position updates
- Apply `will-change: transform` to cursor element

### Edge Cases
- **Mouse leaves window:** Cursor fades out smoothly
- **Iframes:** Custom cursor won't track inside iframes (acceptable)
- **Reduced motion:** Respect `prefers-reduced-motion` – disable cursor animations (follows `globals.css` pattern)

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Custom cursor follows mouse on desktop
  Given I am on a desktop device with a mouse (pointer: fine)
  When I move my mouse across the screen
  Then the custom cursor follows smoothly with Framer Motion spring interpolation
  And the native browser cursor is hidden

Scenario: Cursor reacts to CursorTarget elements
  Given I am hovering over an element wrapped in <CursorTarget>
  When my cursor enters the element
  Then the cursor grows from 24px to 48px diameter
  And the cursor color changes from --primary to --accent

Scenario: No custom cursor on touch devices
  Given I am on a touch device (pointer: coarse)
  When I view the page
  Then the custom cursor is hidden via CSS
  And native touch behavior works normally
  And the native cursor is visible

Scenario: Cursor adapts to theme changes
  Given I am on a desktop device
  When I toggle between light and dark mode
  Then the cursor color transitions over 1 second
  And uses the appropriate --primary/--accent theme values

Scenario: Cursor fades out when mouse leaves window
  Given I am on a desktop device
  When my mouse leaves the browser window
  Then the cursor fades out smoothly

Scenario: Reduced motion preference respected
  Given I have prefers-reduced-motion enabled in my OS
  When I view the page on desktop
  Then the cursor follows the mouse without spring animation
  And hover state changes are instant (no transition)

Scenario: Cursor renders above all content
  Given there are modals, popovers, or fixed headers on the page
  When I move my mouse over them
  Then the custom cursor remains visible above all content (z-index: 9999)
```

## Implementation Notes

### Files to Create
1. `/components/custom-cursor.tsx` - Main cursor component (client component)
2. `/components/cursor-target.tsx` - Wrapper component for hover detection
3. `/hooks/use-cursor.ts` - Custom hook for cursor state management

### Files to Modify
1. `/app/globals.css` - Add `cursor: none` for `pointer: fine` and hide cursor for `pointer: coarse`
2. `/app/layout.tsx` - Add `<CustomCursor />` component

### Testing Requirements
- Test cursor renders on `pointer: fine` devices (mock `matchMedia`)
- Test cursor does NOT render/show on `pointer: coarse` devices
- Test position tracking works correctly
- Test hover state changes with `<CursorTarget>`
- Test theme adaptation
- Test reduced motion behavior
- Test mouse leave fade out

---
##  QA Testing Strategy
> **Context:** Derived from One-Pager constraints and Story acceptance criteria.

### 1. Manual Verification (The Happy Path)
- [ ] **TC-001:** Open site on desktop (pointer: fine)  Move mouse across screen  Verify custom cursor follows smoothly with spring interpolation  Confirm native browser cursor is hidden
- [ ] **TC-002:** Hover over a `<CursorTarget>` wrapped element (e.g., button/link)  Verify cursor grows from 24px to 48px diameter  Verify cursor color changes from `--primary` to `--accent`
- [ ] **TC-003:** Open site on touch device (iOS/Android) or emulate `pointer: coarse`  Verify custom cursor is NOT visible  Verify native touch behavior works normally
- [ ] **TC-004:** On desktop, toggle between light and dark mode  Verify cursor color transitions smoothly over 1 second  Confirm cursor uses appropriate `--primary`/`--accent` theme values
- [ ] **TC-005:** On desktop, move mouse outside browser window  Verify cursor fades out smoothly (no abrupt disappear)
- [ ] **TC-006:** Enable "Reduce Motion" in OS settings  View page on desktop  Verify cursor follows mouse WITHOUT spring animation (instant position)  Verify hover state changes are instant (no transition)
- [ ] **TC-007:** Open page with modals, popovers, or fixed headers  Move mouse over them  Verify custom cursor remains visible above all content (z-index: 9999)

### 2. Edge Cases & Destructive Testing
- [ ] **TC-008:** Rapid mouse movement across screen  Verify cursor keeps up without noticeable lag or jank
- [ ] **TC-009:** Move mouse in/out of browser window rapidly  Verify no JavaScript errors in console  Verify fade behavior is consistent
- [ ] **TC-010:** Resize desktop browser to mobile width (< 640px)  Verify cursor behavior remains consistent (CSS hides on pointer: coarse, not viewport width)
- [ ] **TC-011:** Open DevTools  Throttle CPU to 4x slowdown  Move mouse  Verify cursor still performs acceptably (requestAnimationFrame optimization)
- [ ] **TC-012:** Hover over an iframe element  Verify custom cursor stops tracking inside iframe (expected behavior, no errors)
- [ ] **TC-013:** Hard refresh page (Ctrl+Shift+R)  Verify no hydration mismatch errors in console  Verify cursor renders correctly after mount
- [ ] **TC-014:** Toggle theme rapidly (spam click) while moving cursor  Verify no visual glitches or console errors

### 3. One-Pager Constraints Check
- [ ] **Performance:** Run Lighthouse audit on desktop  Verify Performance score > 80  Confirm cursor component does not cause main thread blocking
- [ ] **Accessibility:** Verify cursor does not interfere with screen reader navigation  Custom cursor is purely visual enhancement
- [ ] **Touch Devices:** Test on real iOS Safari and Android Chrome  Confirm `pointer: coarse` media query correctly hides cursor
- [ ] **Responsive:** Test at 320px viewport width on desktop  Verify cursor still works (touch detection is pointer-based, not viewport-based)
- [ ] **will-change:** Inspect cursor element in DevTools  Verify `will-change: transform` is applied for GPU acceleration
- [ ] **Portal Rendering:** Inspect DOM  Verify cursor is rendered via Portal to `document.body` (not nested in component tree)
