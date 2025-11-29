**Status:** DRAFT
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| 001 | Project Foundation & Dependencies Setup | Done |
| 006 | Navigation & Layout Shell | Done |

## Title
Contact Form UI

## Description
**User Story:**
As a visitor, I want to fill out a contact form, so that I can reach out to Barbar Ahmad for opportunities.

**Context:**
Create a contact form with fields: name, email, message. Message field has 500 character max with live character count display. Use Zod for validation schema. Form should be accessible and responsive with proper labels and error states.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Contact form displays all fields
  Given I navigate to the contact section or /contact
  When the form loads
  Then I see fields for name, email, and message

Scenario: Character count displays for message
  Given I am typing in the message field
  When I type characters
  Then I see a live character count (e.g., "123/500")

Scenario: Validation errors display
  Given I submit the form with empty fields
  When validation runs
  Then I see error messages for required fields

Scenario: Email validation works
  Given I enter an invalid email format
  When I submit the form
  Then I see an error message about invalid email

Scenario: Form is accessible
  Given I am using a screen reader
  When I navigate the form
  Then all fields have proper labels and ARIA attributes
```
