---
**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |
| 002 | Theme System (Dark/Light Mode) | Done |

## Title
Navigation & Layout Shell

## Description
**User Story:**
As a visitor, I want a consistent navigation header across all pages, so that I can easily navigate between sections and pages.

**Context:**
Create the root layout with header navigation. Header should include: logo/name, nav links (Home, Projects, Blog, Contact), and theme toggle. Navigation should work for both anchor links on homepage and route links to separate pages. Responsive hamburger menu on mobile.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Navigation is visible on all pages
  Given I am on any page of the portfolio
  When the page loads
  Then I see a header with navigation links

Scenario: Navigation links work correctly
  Given I am on the homepage
  When I click on "Blog" in the nav
  Then I am navigated to /blog

Scenario: Theme toggle in header
  Given I am viewing the header
  When I click the theme toggle icon
  Then the theme switches between dark and light

Scenario: Mobile hamburger menu
  Given I am on a mobile device (viewport < 768px)
  When I view the header
  Then I see a hamburger menu icon
  And clicking it reveals the navigation links

Scenario: Active state on current page
  Given I am on /blog
  When I view the navigation
  Then the Blog link is visually highlighted as active
```
