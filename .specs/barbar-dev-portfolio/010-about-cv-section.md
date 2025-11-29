---
**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 005 | Smooth Scroll & Section Animations | Done |
| 006 | Navigation & Layout Shell | Done |

## Title
About/CV Section on Homepage

## Description
**User Story:**
As a visitor (employer/recruiter), I want to see a professional background section, so that I can evaluate my experience and skills.

**Context:**
Create the About/CV section on the homepage with: bio, key achievements (with emoji highlights), work experience timeline, education, and skills list. Content is provided in the One-Pager. Section should animate in on scroll.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: About section displays bio
  Given I scroll to the About section
  When the section loads
  Then I see Barbar Ahmad's professional bio

Scenario: Key achievements are highlighted
  Given I am viewing the About section
  When I look at achievements
  Then I see 5 key achievements with emoji icons

Scenario: Work experience timeline is shown
  Given I am viewing the About section
  When I look at experience
  Then I see a timeline with StoneX roles and dates

Scenario: Skills are displayed
  Given I am viewing the About section
  When I look at skills
  Then I see a list/grid of technical skills (React, .NET, TypeScript, etc.)

Scenario: LinkedIn link is present
  Given I am viewing the About section
  When I look for social links
  Then I see a link to LinkedIn profile
```
