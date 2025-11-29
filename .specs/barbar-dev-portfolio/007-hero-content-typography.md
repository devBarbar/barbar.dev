---
**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 004 | 3D Hero Section with WebGL Particles | Done |
| 005 | Smooth Scroll & Section Animations | Done |
| 006 | Navigation & Layout Shell | Done |

## Title
Hero Section Content & Typography

## Description
**User Story:**
As a visitor, I want to see bold typography with my name, title, and a brief tagline in the hero section, so that I immediately understand who I am and what I do.

**Context:**
Overlay bold typography on top of the 3D canvas. Display: "Barbar Ahmad", "Lead Software Engineer", and a short tagline. Include a CTA button to scroll to projects or contact. Typography should be responsive and readable on all devices.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Hero displays name and title
  Given I visit the homepage
  When the hero section loads
  Then I see "Barbar Ahmad" prominently displayed
  And I see "Lead Software Engineer" as subtitle

Scenario: CTA button is present
  Given I am viewing the hero section
  When I look for actions
  Then I see a primary CTA button (e.g., "View My Work" or "Get in Touch")

Scenario: CTA scrolls to target section
  Given I am in the hero section
  When I click the CTA button
  Then the page smoothly scrolls to the projects or contact section

Scenario: Typography is responsive
  Given I am on a mobile device
  When I view the hero
  Then the typography scales appropriately and remains readable
  And text does not overflow the viewport
```
