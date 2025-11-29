---
**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 015 | Contact Form UI | Done |

## Title
Contact Form Submission & Formspree Integration

## Description
**User Story:**
As a visitor, I want my contact form submission to be sent successfully, so that Barbar Ahmad receives my message.

**Context:**
Integrate Formspree for form submission (no custom backend). On success: display success toast via Sonner. On error: display error toast within 300ms AND render fallback mailto:contact@barbar.dev button inline below the form.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Successful form submission
  Given I fill out the contact form with valid data
  When I submit the form
  Then the form submits to Formspree
  And I see a success toast notification

Scenario: Error shows toast and fallback
  Given Formspree returns an error
  When the error response is received
  Then I see an error toast within 300ms
  And a mailto:contact@barbar.dev fallback button appears below the form

Scenario: Loading state during submission
  Given I submit the form
  When the request is in progress
  Then I see a loading indicator on the submit button
  And the button is disabled

Scenario: Form resets after success
  Given my form submission was successful
  When the success toast appears
  Then the form fields are cleared

Scenario: Fallback button works
  Given the error fallback button is visible
  When I click it
  Then my email client opens with contact@barbar.dev as recipient
```
