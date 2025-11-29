**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |

## Title
MDX Blog Infrastructure

## Description
**User Story:**
As a developer, I want MDX blog infrastructure set up, so that I can write blog posts in Markdown with React components.

**Context:**
Configure @next/mdx or contentlayer for processing MDX files. Set up /content/blog/ directory structure. Define frontmatter schema: title (required), publishedAt (required, ISO date), summary (required), tags (optional array). Create utility functions to read and parse blog posts.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: MDX files are processed
  Given I have an MDX file in /content/blog/
  When the build runs
  Then the MDX is compiled to a renderable React component

Scenario: Frontmatter is parsed correctly
  Given an MDX file has frontmatter with title, publishedAt, summary
  When I query the blog posts
  Then the frontmatter values are accessible as metadata

Scenario: Blog utility functions work
  Given utility functions getAllPosts() and getPostBySlug()
  When I call getAllPosts()
  Then I receive an array of blog posts sorted by publishedAt descending

Scenario: Tags are optional
  Given an MDX file without tags in frontmatter
  When the file is parsed
  Then no error occurs and tags defaults to empty array
```
