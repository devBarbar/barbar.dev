**Status:** READY FOR QA
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

## Technical Decisions

### Data & Validation
| Decision | Answer |
|:---------|:-------|
| Message max chars | 500 (client + server-side Zod validation) |
| Name max chars | 100 (server-side Zod validation) |
| Char count method | Grapheme clusters (not code units) |
| Paste over limit | Reject (do not truncate) |
| Draft persistence | Not needed (no localStorage) |

### Logic & Behavior
| Decision | Answer |
|:---------|:-------|
| Form placement | Bottom of every page (not just homepage) |
| Validation trigger | On submit only |
| Character counter | Animate with section (scale animation) |
| Counter color feedback | Yes (yellow at ~80%, red at ~96%) |
| Hydration state | Show disabled/loading state during hydration |
| Submit button | Disable immediately on click (prevent double-submit) |
| Network timeout | 30 seconds |
| Focus order | Name → Email → Message → Submit |

### UI Components
| Decision | Answer |
|:---------|:-------|
| Textarea component | Add via `npx shadcn@latest add textarea` |
| Label component | Add via `npx shadcn@latest add label` |
| Error display | Inline below each field |
| Labels | Visible labels above each field |
| Button size | Existing `h-9` acceptable (accessibility ok) |
| Custom cursor | Text cursor variant for form inputs |
| Section heading | Yes (e.g., "Get In Touch") with `<h2 id="contact-heading">` |

### Security
| Decision | Answer |
|:---------|:-------|
| XSS sanitization | Formspree handles (no client-side needed) |

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: Contact form displays all fields
  Given I navigate to the contact section
  When the form loads
  Then I see fields for name, email, and message
  And each field has a visible label above it
  And the section has a heading "Get In Touch" or similar

Scenario: Character count displays for message
  Given I am typing in the message field
  When I type characters
  Then I see a live character count (e.g., "123/500")
  And the counter animates with the section
  And the counter turns yellow at ~400 chars
  And the counter turns red at ~480 chars

Scenario: Character limit enforced
  Given I paste text exceeding 500 grapheme clusters
  When the paste event fires
  Then the paste is rejected
  And the existing content remains unchanged

Scenario: Validation errors display
  Given I submit the form with empty fields
  When validation runs on submit
  Then I see inline error messages below each invalid field

Scenario: Email validation works
  Given I enter an invalid email format
  When I submit the form
  Then I see an inline error message about invalid email below the email field

Scenario: Name validation works
  Given I enter a name longer than 100 characters
  When I submit the form
  Then I see an inline error message about name length

Scenario: Form is accessible
  Given I am using a screen reader
  When I navigate the form
  Then all fields have proper labels with htmlFor association
  And error messages are announced via aria-describedby
  And focus order is Name → Email → Message → Submit

Scenario: Form shows hydration state
  Given JavaScript is loading
  When the page first renders
  Then the form appears in a disabled/loading state
  And the submit button shows a loading indicator

Scenario: Custom cursor shows text mode
  Given I am on a desktop device
  When I hover over a form input field
  Then the custom cursor changes to text-cursor variant
```

## Files to Create/Modify
| File | Action | Notes |
|:-----|:-------|:------|
| `components/ui/textarea.tsx` | Add | Via shadcn CLI |
| `components/ui/label.tsx` | Add | Via shadcn CLI |
| `components/contact-section.tsx` | Create | Main section wrapper with heading |
| `components/contact-form.tsx` | Create | Form with Zod validation |
| `lib/contact.ts` | Create | Zod schema for contact form |
| `app/page.tsx` | Modify | Add ContactSection at bottom |
| `app/layout.tsx` | Modify | Add ContactSection to layout (appears on all pages) |
| `components/custom-cursor.tsx` | Modify | Add text-cursor variant |
| `app/globals.css` | Modify | Add character counter color styles |

---

##  QA Testing Strategy
> **Context:** Derived from One-Pager constraints and Story acceptance criteria.

### 1. Manual Verification (The Happy Path)
- [ ] **TC-001:** Navigate to contact section  Verify Name, Email, Message fields visible with labels above each
- [ ] **TC-002:** Verify section heading "Get In Touch" (or similar) with `<h2 id="contact-heading">` present
- [ ] **TC-003:** Type in message field  Verify live character counter shows "X/500" format
- [ ] **TC-004:** Type 400+ characters  Verify counter turns yellow (~80% threshold)
- [ ] **TC-005:** Type 480+ characters  Verify counter turns red (~96% threshold)
- [ ] **TC-006:** Submit form with all valid data  Verify form accepts submission (next story handles actual send)
- [ ] **TC-007:** Tab through form  Verify focus order: Name  Email  Message  Submit
- [ ] **TC-008:** Use screen reader (NVDA/VoiceOver)  Verify labels announced, errors use aria-describedby

### 2. Edge Cases & Destructive Testing
- [ ] **TC-009:** Submit form with all fields empty  Verify inline error messages appear below each field
- [ ] **TC-010:** Enter invalid email (e.g., "notanemail", "test@", "@test.com")  Verify inline email validation error
- [ ] **TC-011:** Enter name > 100 characters  Verify inline name length error on submit
- [ ] **TC-012:** Paste text > 500 grapheme clusters into message  Verify paste is rejected, existing content unchanged
- [ ] **TC-013:** Enter 500 exactly  Verify no error, counter shows "500/500"
- [ ] **TC-014:** Enter 501 characters via paste  Verify paste rejected entirely
- [ ] **TC-015:** Enter emoji/special characters ()  Verify grapheme cluster counting (not code units)
- [ ] **TC-016:** Rapidly click Submit multiple times  Verify button disables immediately (no double-submit)
- [ ] **TC-017:** Hard refresh page during hydration  Verify form shows disabled/loading state briefly
- [ ] **TC-018:** Enter XSS payload `<script>alert('xss')</script>`  Verify no script execution (Formspree sanitizes)

### 3. One-Pager Constraints Check

#### Performance (Guardrail: Lighthouse > 80)
- [ ] **TC-019:** Run Lighthouse audit on page with contact form  Verify Performance > 80
- [ ] **TC-020:** Run Lighthouse audit  Verify Accessibility > 80
- [ ] **TC-021:** Run Lighthouse audit  Verify Best Practices > 80
- [ ] **TC-022:** Run Lighthouse audit  Verify SEO > 80

#### Responsive Design (Mobile-first, min 320px)
- [ ] **TC-023:** Test on 320px viewport width  Verify form is usable, no horizontal scroll
- [ ] **TC-024:** Test on mobile viewport  Verify all touch targets  44x44px (Name, Email, Message, Submit)
- [ ] **TC-025:** Test on tablet (768px)  Verify layout adjusts appropriately
- [ ] **TC-026:** Test on desktop (1024px+)  Verify layout uses available space

#### Custom Cursor Integration
- [ ] **TC-027:** Hover over form input on desktop  Verify custom cursor changes to text-cursor variant
- [ ] **TC-028:** Test on touch device  Verify custom cursor does not appear (`pointer: coarse` check)

#### Theme Compatibility
- [ ] **TC-029:** Toggle to dark mode  Verify form styling adapts (contrast, colors)
- [ ] **TC-030:** Toggle to light mode  Verify form styling adapts correctly
- [ ] **TC-031:** Hard refresh in dark mode  Verify no flash of wrong theme (form included)

#### Cross-Browser Testing
- [ ] **TC-032:** Test in Chrome  Verify all scenarios work
- [ ] **TC-033:** Test in Firefox  Verify all scenarios work
- [ ] **TC-034:** Test in Safari  Verify all scenarios work
- [ ] **TC-035:** Test in Edge  Verify all scenarios work

#### Form Placement (One-Pager: appears on all pages)
- [ ] **TC-036:** Navigate to Homepage (/)  Verify contact form present at bottom
- [ ] **TC-037:** Navigate to Blog Listing (/blog)  Verify contact form present at bottom
- [ ] **TC-038:** Navigate to Blog Post (/blog/[slug])  Verify contact form present at bottom
- [ ] **TC-039:** Navigate to Project Case Study (/projects/[slug])  Verify contact form present at bottom
