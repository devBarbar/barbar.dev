**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |
| 002 | Theme System (Dark/Light Mode) | Done |

## Title
3D Hero Section with WebGL Particles

## Description
**User Story:**
As a visitor, I want to see an immersive 3D particle animation in the hero section, so that I get a memorable first impression of the portfolio.

**Context:**
Build a React Three Fiber canvas with floating geometric particles (icosahedrons, torus knots). Particles react to mouse movement, slowly drift and rotate with bloom/glow effects. Colors shift on theme toggle. Implement adaptive performance: reduce particles by 50% if FPS drops below 30. Gracefully hide if WebGL unavailable.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: 3D particles render in hero
  Given I visit the homepage
  When the page loads
  Then I see a 3D canvas with floating geometric particles

Scenario: Particles react to mouse movement
  Given the 3D hero is visible
  When I move my mouse across the canvas
  Then the particles subtly react to the mouse position

Scenario: Colors shift on theme toggle
  Given I am viewing the 3D hero in dark mode
  When I toggle to light mode
  Then the particle colors transition to light mode accent colors over 1 second

Scenario: Adaptive performance on low FPS
  Given my device is struggling to render at 30fps
  When FPS drops below 30 for sustained period
  Then particle count is reduced by 50% dynamically

Scenario: WebGL unavailable fallback
  Given my browser does not support WebGL
  When I visit the homepage
  Then the 3D canvas is hidden gracefully (no error, no blank space)

Scenario: Mobile performance
  Given I am on a mobile device
  When the hero loads
  Then the 3D canvas does not block main thread for more than 50ms
```
