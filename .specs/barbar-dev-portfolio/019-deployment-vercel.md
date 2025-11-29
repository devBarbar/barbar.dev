**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 018 | Performance Optimization & Lighthouse Audit | Done |

## Title
Deployment to Vercel

## Description
**User Story:**
As a site owner, I want the portfolio deployed to Vercel with the barbar.dev domain, so that it is publicly accessible.

**Context:**
Deploy the Next.js application to Vercel. Configure the custom domain barbar.dev (already registered). Ensure environment variables for Formspree are set. Verify production build works correctly.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Site is deployed to Vercel
  Given the code is pushed to the main branch
  When Vercel builds the project
  Then the build completes successfully without errors

Scenario: Custom domain works
  Given the site is deployed
  When I navigate to https://barbar.dev
  Then I see the portfolio homepage

Scenario: Environment variables are configured
  Given Formspree endpoint is required
  When the contact form submits
  Then it uses the correct Formspree endpoint from environment variables

Scenario: Production build is optimized
  Given the production build
  When I check bundle size
  Then the bundle is optimized with code splitting

Scenario: HTTPS is enabled
  Given I visit barbar.dev
  When I check the connection
  Then the site is served over HTTPS with valid certificate
```
