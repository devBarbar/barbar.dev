**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 006 | Navigation & Layout Shell | Done |
| 011 | MDX Blog Infrastructure | Done |

## Title
Blog Listing Page

## Description
**User Story:**
As a visitor, I want to see a list of all blog posts, so that I can browse and choose articles to read.

**Context:**
Create /blog page that displays all blog posts. Each post shows: title, publishedAt date, summary, and optional tags. Posts are sorted by publishedAt descending. Page should be clean and readable with consistent spacing.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Blog listing page loads
  Given I navigate to /blog
  When the page loads
  Then I see a list of blog posts

Scenario: Posts show title, date, and summary
  Given I am on the blog listing page
  When I view a post entry
  Then I see the title, formatted date, and summary

Scenario: Posts are sorted by date descending
  Given there are multiple blog posts
  When I view the listing
  Then the most recent post appears first

Scenario: Posts link to individual pages
  Given I am viewing the blog listing
  When I click on a post title
  Then I am navigated to /blog/[slug] for that post

Scenario: Empty state handled
  Given there are no blog posts
  When I visit /blog
  Then I see a friendly message like "No posts yet"
```
