---
**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 011 | MDX Blog Infrastructure | Done |
| 012 | Blog Listing Page | Done |

## Title
Blog Post Detail Page

## Description
**User Story:**
As a visitor, I want to read individual blog posts with proper formatting, so that I can consume long-form content comfortably.

**Context:**
Create /blog/[slug] dynamic route for individual posts. Render MDX content with proper typography and code highlighting. Display title, publishedAt date, and tags at the top. Clean, readable layout optimized for long-form content.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Blog post page renders MDX content
  Given I navigate to /blog/meet-barbar-ahmad
  When the page loads
  Then I see the full blog post content rendered from MDX

Scenario: Post metadata is displayed
  Given I am on a blog post page
  When I view the header
  Then I see the title, publishedAt date, and tags (if any)

Scenario: Code blocks are highlighted
  Given a blog post contains code snippets
  When I view the post
  Then code blocks have syntax highlighting

Scenario: Invalid slug returns 404
  Given I navigate to /blog/non-existent-post
  When the page attempts to load
  Then I see a 404 error page

Scenario: Post page is responsive
  Given I am on mobile
  When I read a blog post
  Then the text is readable with appropriate line length and spacing
```
