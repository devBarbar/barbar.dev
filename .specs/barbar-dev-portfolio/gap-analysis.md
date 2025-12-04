#  Requirements Coverage & Gap Analysis
> **Status:**  **FAIL** - Missing Stories Identified
> **Date:** December 4, 2025
> **Project:** barbar-dev-portfolio

---

##  Executive Summary

| Metric | Count |
|:-------|------:|
| Total Requirements in One-Pager | 62 (49 FR + 13 NFR) |
| Requirements with Story Coverage | 58 |
| **Missing Requirements** | 1 (Story 014 file missing) |
| **Partial Coverage** | 3 |
| Stories Defined | 19 (001-019, with 014 missing file) |

---

##  Missing Requirements (Action Required)
> *These items are in the One-Pager but have NO User Stories or missing story files.*

| One-Pager Section | Requirement ID | Description | Recommended Action |
| :--- | :--- | :--- | :--- |
| 7. First Blog Post Content | **[FR-44]** | Ship with 1 real blog post ("Meet Barbar Ahmad: A Journey in Software Engineering") | **Create story file** `014-first-blog-post.md` - Story is referenced in memory.instructions.md (status:  Draft) but no file exists |

---

##  Partial / Vague Coverage
> *These items exist but seem incomplete based on the stories.*

### 1. **Project Screenshots/Thumbnails** [FR-16]
* **Gap:** One-Pager mentions "Project screenshots/thumbnails (can be added post-launch)" as a remaining item.
* **Current Status:** Story 008 and 009 reference placeholder images but no real screenshots exist.
* **Fix:** Add to deployment checklist or create separate asset story.

### 2. **WebGL Fallback Behavior** [FR-31]
* **One-Pager:** "If WebGL unavailable, gracefully hide 3D canvas (no error, no blank space)"
* **Story 004:** Covers this in acceptance criteria but specific fallback UI is vague ("show solid background color").
* **Fix:** Add explicit QA test case for WebGL disabled scenario in TC-008.

### 3. **Adaptive Particle Count on FPS Drop** [NFR-05]
* **One-Pager:** "Detect FPS drops below 30fps using `requestAnimationFrame` timing; reduce particle count by 50% dynamically"
* **Story 004:** Implements this but QA noted hysteresis behavior (restore at 45fps for 2s) may need verification.
* **Fix:** Ensure TC-009 and TC-010 in Story 004 are completed during QA phase.

---

##  Covered Requirements

### Core Features
- [x] **[FR-01]** Hero Section with 3D WebGL background  Covered by `004-3d-hero-section.md`
- [x] **[FR-02]** Projects Showcase: 3 featured hero projects  Covered by `008-projects-section-homepage.md`
- [x] **[FR-03]** CV/About Section with professional background  Covered by `010-about-cv-section.md`
- [x] **[FR-04]** Blog with MDX-powered articles  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-05]** Contact Form: name/email/message  Covered by `015-contact-form-ui.md`
- [x] **[FR-06]** Dark/Light Mode toggle  Covered by `002-theme-system.md`
- [x] **[FR-07]** Custom Cursor interactive animations  Covered by `003-custom-cursor.md`
- [x] **[FR-08]** Smooth Scroll with Framer Motion transitions  Covered by `005-smooth-scroll-animations.md`

### User Experience
- [x] **[FR-09]** Immersive 3D hero with bold typography  Covered by `004-3d-hero-section.md` + `007-hero-content-typography.md`
- [x] **[FR-10]** Smooth scrolling between sections with animation triggers  Covered by `005-smooth-scroll-animations.md`
- [x] **[FR-11]** Interactive cursor reacts to hoverable elements  Covered by `003-custom-cursor.md`
- [x] **[FR-12]** Project cards with hover effects and case study views  Covered by `008-projects-section-homepage.md` + `009-project-case-study-pages.md`
- [x] **[FR-13]** Clean, readable blog layout for long-form content  Covered by `013-blog-post-detail-page.md`
- [x] **[FR-14]** Accessible light/dark mode toggle  Covered by `002-theme-system.md`

### In Scope Features
- [x] **[FR-15]** Hero section with 3D WebGL effect  Covered by `004-3d-hero-section.md`
- [x] **[FR-16]** Projects section featuring 3 hero projects  Covered by `008-projects-section-homepage.md`
- [x] **[FR-17]** CV/About section with professional background  Covered by `010-about-cv-section.md`
- [x] **[FR-18]** Blog setup with MDX infrastructure  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-19]** Simple contact form  Covered by `015-contact-form-ui.md`
- [x] **[FR-20]** Light/Dark mode toggle  Covered by `002-theme-system.md`
- [x] **[FR-21]** Smooth scroll animations with Framer Motion  Covered by `005-smooth-scroll-animations.md`
- [x] **[FR-22]** Custom cursor animation  Covered by `003-custom-cursor.md`

### Contact Form Details
- [x] **[FR-23]** Formspree integration for contact form backend  Covered by `016-contact-form-submission.md`
- [x] **[FR-24]** Zod schema validation for contact form  Covered by `015-contact-form-ui.md`
- [x] **[FR-25]** Name field: required, non-empty string  Covered by `015-contact-form-ui.md`
- [x] **[FR-26]** Email field: required, valid email format  Covered by `015-contact-form-ui.md`
- [x] **[FR-27]** Message field: required, max 500 chars with counter  Covered by `015-contact-form-ui.md`
- [x] **[FR-28]** Display success toast via Sonner  Covered by `016-contact-form-submission.md`
- [x] **[FR-29]** Display error toast + mailto fallback button  Covered by `016-contact-form-submission.md`
- [x] **[FR-30]** Mailto fallback button appears inline below form  Covered by `016-contact-form-submission.md`

### 3D & Performance
- [x] **[FR-31]** Gracefully hide 3D canvas if WebGL unavailable  Covered by `004-3d-hero-section.md`
- [x] **[FR-32]** Desktop: custom animated cursor with Framer Motion  Covered by `003-custom-cursor.md`
- [x] **[FR-33]** Touch devices: degrade to native touch (no cursor)  Covered by `003-custom-cursor.md`
- [x] **[FR-34]** Use pointer:coarse media query for touch detection  Covered by `003-custom-cursor.md`

### Theme System
- [x] **[FR-35]** Theme persistence via localStorage (next-themes)  Covered by `002-theme-system.md`
- [x] **[FR-36]** localStorage value > system preference priority  Covered by `002-theme-system.md`

### Blog System
- [x] **[FR-37]** Blog content in `/content/blog/` directory  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-38]** Frontmatter schema for blog posts  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-39]** Frontmatter: title (required string)  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-40]** Frontmatter: publishedAt (required ISO date)  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-41]** Frontmatter: summary (required string)  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-42]** Frontmatter: tags (optional string array)  Covered by `011-mdx-blog-infrastructure.md`
- [x] **[FR-43]** Display publishedAt on blog pages and listing  Covered by `012-blog-listing-page.md` + `013-blog-post-detail-page.md`
- [ ] **[FR-44]** Ship with 1 real blog post  **MISSING STORY FILE** (014)
- [x] **[FR-45]** Blog listing sorted by publishedAt descending  Covered by `011-mdx-blog-infrastructure.md` + `012-blog-listing-page.md`

### Custom Cursor & Responsive
- [x] **[FR-46]** Custom cursor hidden on touch devices  Covered by `003-custom-cursor.md`
- [x] **[FR-47]** Particle field with icosahedrons/torus reacting to mouse  Covered by `004-3d-hero-section.md`
- [x] **[FR-48]** Particles drift/rotate with bloom/glow effects  Covered by `004-3d-hero-section.md`
- [x] **[FR-49]** Particle colors shift on theme toggle  Covered by `004-3d-hero-section.md`

### Non-Functional Requirements
- [x] **[NFR-01]** Lighthouse score > 80 (guardrail metric)  Covered by `018-performance-lighthouse.md`
- [x] **[NFR-02]** Responsive design: mobile + desktop  Covered by `017-responsive-mobile.md`
- [x] **[NFR-03]** Toast appears within 300ms of form response  Covered by `016-contact-form-submission.md`
- [x] **[NFR-04]** Lighthouse >80 on all metrics (desktop + mobile)  Covered by `018-performance-lighthouse.md`
- [x] **[NFR-05]** Adaptive particle count: reduce 50% when FPS <30  Covered by `004-3d-hero-section.md`
- [x] **[NFR-06]** 3D canvas: no main thread blocking >50ms on mobile  Covered by `004-3d-hero-section.md`
- [x] **[NFR-07]** Block render until theme resolved (no FOUC)  Covered by `002-theme-system.md`
- [x] **[NFR-08]** 1-second CSS transition on theme toggle  Covered by `002-theme-system.md`
- [x] **[NFR-09]** No flash of wrong theme on initial page load  Covered by `002-theme-system.md`
- [x] **[NFR-10]** Mobile-first; 320px minimum viewport width  Covered by `017-responsive-mobile.md`
- [x] **[NFR-11]** Reduced particle count on mobile/low-powered devices  Covered by `004-3d-hero-section.md`
- [x] **[NFR-12]** Minimum 44x44px touch targets on mobile  Covered by `017-responsive-mobile.md`

---

##  Story Coverage Matrix

| Story ID | Title | Status | One-Pager Refs |
|:---------|:------|:-------|:---------------|
| 001 | Project Foundation & Dependencies Setup |  QA | Foundation |
| 002 | Theme System (Dark/Light Mode) |  Done | FR-06, FR-14, FR-20, FR-35, FR-36, NFR-07, NFR-08, NFR-09 |
| 003 | Custom Cursor Component |  Done | FR-07, FR-11, FR-22, FR-32, FR-33, FR-34, FR-46 |
| 004 | 3D Hero Section with WebGL Particles |  Done | FR-01, FR-09, FR-15, FR-31, FR-47, FR-48, FR-49, NFR-05, NFR-06, NFR-11 |
| 005 | Smooth Scroll & Section Animations |  QA | FR-08, FR-10, FR-21 |
| 006 | Navigation & Layout Shell |  Done | Navigation |
| 007 | Hero Section Content & Typography |  Draft | FR-09 |
| 008 | Projects Section on Homepage |  QA | FR-02, FR-12, FR-16 |
| 009 | Project Case Study Pages |  QA | FR-12 |
| 010 | About/CV Section on Homepage |  QA | FR-03, FR-17 |
| 011 | MDX Blog Infrastructure |  Done | FR-04, FR-18, FR-37-FR-42, FR-45 |
| 012 | Blog Listing Page |  Done | FR-43, FR-45 |
| 013 | Blog Post Detail Page |  QA | FR-13, FR-43 |
| **014** | **First Blog Post** | ** Draft** | **FR-44** - **FILE MISSING** |
| 015 | Contact Form UI |  Done | FR-05, FR-19, FR-24-FR-27 |
| 016 | Contact Form Submission |  Draft | FR-23, FR-28-FR-30, NFR-03 |
| 017 | Responsive Design & Mobile Optimization |  Draft | NFR-02, NFR-10, NFR-12 |
| 018 | Performance Optimization & Lighthouse Audit |  Draft | NFR-01, NFR-04 |
| 019 | Deployment to Vercel |  Draft | Deployment |

---

##  Recommended Actions

### Critical (Before Launch)
1. **Create `014-first-blog-post.md`** story file with acceptance criteria for the initial blog post content.
2. **Complete QA** for stories in  QA status (001, 005, 008, 009, 010, 013).

### Important (Polish Phase)
3. **Add real project screenshots** to replace placeholder images (currently in `/public/images/projects/`).
4. **Verify WebGL fallback** behavior with explicit browser-disabled WebGL test.
5. **Complete responsive testing** at 320px viewport for all pages.

### Nice to Have
6. **Add code blocks** to blog post to verify syntax highlighting (TC-005, TC-006 in Story 013).
7. **Cross-browser testing** in Firefox, Safari, Edge (several TC marked as pending).

---

##  Conclusion

The requirements coverage is **93.5% complete** (58/62 requirements have story coverage). The main gap is the **missing story file for 014-first-blog-post.md**, which is documented in memory.instructions.md but the actual spec file doesn't exist in the `.specs/barbar-dev-portfolio/` directory.

**Recommendation:** Create the missing story file before proceeding to deployment to ensure all One-Pager requirements are traceable.
