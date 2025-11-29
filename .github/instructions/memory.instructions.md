---
applyTo: '**'
---

# 🧠 Project Memory & AI Instructions
> **System Context for AI Agents**  
> *File:* `.github/instructions/memory.instructions.md`  
> *Last Updated:* 2025-11-29

---

## 1. Project Vision & North Star

* **Core Mission:** Build an award-caliber personal portfolio website that showcases Barbar Ahmad's skills, projects, and personality to attract employers and establish credibility in the dev/design community.
* **Target Launch:** November 30, 2025
* **Key Business Metrics:**
  * 🎯 **North Star:** 5+ inbound employer/recruiter inquiries within 30 days
  * 🏆 Awwwards nomination or Honorable Mention
  * 📊 500+ unique visitors in first month
  * ⚡ Lighthouse score > 80 on all metrics (Performance, A11y, Best Practices, SEO)

---

## 2. Ubiquitous Language (Global Glossary)

> *Terms used across ALL features.*

| Term | Definition |
|:-----|:-----------|
| **FOUC** | Flash of Unstyled Content – prevented via `next-themes` blocking script |
| **Hero Section** | The immersive 3D WebGL particle canvas displayed prominently on homepage |
| **Theme Toggle** | Binary switch between `light` ↔ `dark` mode (no system option in UI) |
| **Adaptive Performance** | Dynamic reduction of 3D particles by 50% when FPS < 30 |
| **Touch Device** | Device with `pointer: coarse` – custom cursor not rendered |
| **Blog Post** | MDX file in `/content/blog/` with required frontmatter |
| **Frontmatter** | YAML metadata block at top of MDX: `title`, `publishedAt`, `summary`, `tags` |
| **Case Study** | Detailed project page at `/projects/[slug]` |
| **Fallback Button** | `mailto:contact@barbar.dev` button shown when Formspree fails |
| **RSC** | React Server Components – default component type (no directive needed) |
| **Client Component** | Requires `"use client"` directive for hooks/browser APIs |

---

## 3. Technology Standards

### Stack
| Layer | Technology | Notes |
|:------|:-----------|:------|
| Framework | Next.js 16 (App Router) | RSC-first, pages in `/app` |
| Styling | Tailwind CSS v4 + CSS variables | Theme colors in `globals.css` using `oklch()` |
| Components | shadcn/ui (new-york style) | Add via `npx shadcn@latest add <component>` |
| 3D/WebGL | React Three Fiber + drei | Lazy loaded, graceful WebGL fallback |
| Animations | Framer Motion | Scroll-triggered, page transitions |
| Blog | MDX via `@next/mdx` | Content in `/content/blog/`, frontmatter required |
| Forms | Zod validation + Formspree | Toast feedback via `sonner` |
| Theme | next-themes | `class` attribute, localStorage persistence |
| Icons | lucide-react | Sun, Moon, Monitor icons for theme |
| Testing | Vitest + Testing Library | Gherkin-style naming |

### Code Style
* TypeScript strict mode enabled
* Use `cn()` from `@/lib/utils` for Tailwind class merging
* Server Components by default; add `"use client"` only when required
* Path aliases: `@/*` → project root

### Testing Standards
* Tests follow **Gherkin-style** naming: `"Given X, When Y, Then Z"`
* Wrap theme-dependent components in `ThemeProvider` test wrapper
* Mock `matchMedia` for theme tests

---

## 4. Architecture & Data Model (High Level)

### Core Entities
| Entity | Storage | Notes |
|:-------|:--------|:------|
| **Theme** | localStorage (`"theme"`) | Managed by `next-themes` |
| **Blog Post** | MDX files in `/content/blog/` | Frontmatter: title, publishedAt, summary, tags |
| **Project** | Static data in components | 3 featured: Smart Note, Study Smarter, AI Video Generator |
| **Contact Message** | Formspree | No backend required |

### Routing Structure
```
/                  → Homepage (Hero, Projects, About, Contact)
/blog              → Blog listing page
/blog/[slug]       → Blog post detail
/projects/[slug]   → Project case study pages
```

### Directory Structure
```
/app              → Next.js App Router pages & layouts
/components       → React components (client/server)
/components/ui    → shadcn/ui primitives (Button, etc.)
/lib              → Utilities (cn() for Tailwind class merging)
/hooks            → Custom React hooks
/content/blog     → MDX blog posts with frontmatter
/__tests__        → Vitest test files
/.specs           → Feature specs & acceptance criteria (reference only)
```

---

## 5. Feature Registry (Index)

| ID | Feature | Status | Summary |
|:---|:--------|:-------|:--------|
| 001 | Project Foundation & Dependencies | ✅ Done | Next.js, Tailwind v4, shadcn/ui, MDX setup |
| 002 | Theme System (Dark/Light Mode) | ✅ Done | next-themes, 1s transitions, FOUC prevention |
| 003 | Custom Cursor Component | 📋 Draft | Desktop only, hidden on touch devices |
| 004 | 3D Hero Section | 📋 Draft | R3F particles, adaptive performance, theme colors |
| 005 | Smooth Scroll & Animations | 📋 Draft | Framer Motion scroll-triggered |
| 006 | Navigation & Layout Shell | 📋 Draft | Header, nav links, mobile hamburger |
| 007 | Hero Content & Typography | 📋 Draft | Name, title, CTA button |
| 008 | Projects Section (Homepage) | 📋 Draft | 3 project cards with hover effects |
| 009 | Project Case Study Pages | 📋 Draft | `/projects/[slug]` detail pages |
| 010 | About/CV Section | 📋 Draft | Bio, achievements, experience timeline |
| 011 | MDX Blog Infrastructure | 📋 Draft | Frontmatter schema, utility functions |
| 012 | Blog Listing Page | 📋 Draft | `/blog` with sorted posts |
| 013 | Blog Post Detail Page | 📋 Draft | `/blog/[slug]` with MDX rendering |
| 014 | First Blog Post | 📋 Draft | "Meet Barbar Ahmad" content |
| 015 | Contact Form UI | 📋 Draft | Name, email, message (500 char limit) |
| 016 | Contact Form Submission | 📋 Draft | Formspree, success/error toasts, mailto fallback |
| 017 | Responsive Design & Mobile | 📋 Draft | 320px min, 44px touch targets |
| 018 | Performance & Lighthouse | 📋 Draft | >80 all scores, lazy loading |
| 019 | Deployment to Vercel | 📋 Draft | barbar.dev domain, HTTPS |

---

## 6. Global Constraints

### Performance
* **Lighthouse Target:** >80 on Performance, Accessibility, Best Practices, SEO (desktop AND mobile)
* **3D Canvas:** Must not block main thread >50ms on mobile
* **Adaptive Particles:** Reduce by 50% when FPS < 30
* **Lazy Loading:** 3D canvas not in initial bundle

### Accessibility (WCAG)
* **Touch Targets:** Minimum 44×44px on mobile
* **Focus Indicators:** Visible `ring-2` focus ring on interactive elements
* **Screen Reader:** Dynamic `aria-label` on theme toggle
* **Reduced Motion:** Respect `prefers-reduced-motion` (disable transitions)
* **Keyboard Navigation:** All interactive elements focusable and operable

### Theme System
* **Persistence:** localStorage via `next-themes`
* **Priority:** localStorage > system preference
* **Transitions:** 1-second `ease-in-out` on background and accent colors
* **FOUC Prevention:** `suppressHydrationWarning` on `<html>`, blocking script

### Forms & Validation
* **Contact Form Fields:** name (required), email (required, valid format), message (required, max 500 chars)
* **Validation:** Zod schemas
* **Error Handling:** Toast within 300ms, mailto fallback button on failure
* **Success Handling:** Toast notification, form fields cleared

### Responsive Design
* **Approach:** Mobile-first
* **Minimum Viewport:** 320px width
* **Breakpoints:** Mobile < 640px, Tablet 640px+, Desktop 1024px+
* **Custom Cursor:** Hidden on touch devices (`pointer: coarse`)

### Security
* **HTTPS:** Required on production (barbar.dev)
* **Form Sanitization:** XSS payloads must be sanitized
* **No Custom Backend:** Formspree handles contact submissions

---

## 7. Key Personnel & Contact

| Role | Name | Contact |
|:-----|:-----|:--------|
| Owner/Developer | Barbar Ahmad | contact@barbar.dev |
| LinkedIn | — | https://www.linkedin.com/in/barbar-ahmad |
| Domain | — | barbar.dev (registered ✅) |

---

## 8. Featured Projects Data

| Project | Type | Tech Stack |
|:--------|:-----|:-----------|
| **Smart Note** | React Native (Expo) | React Native, Expo, Appwrite, OpenAI, TanStack Query |
| **Study Smarter** | React Web App | TanStack Start, Supabase, OpenAI GPT-4o, TypeScript |
| **AI Video Generator** | Full-Stack Web | TanStack Start, .NET 9 API, MongoDB, OpenAI |

---

## 9. Blog Frontmatter Schema

```yaml
---
title: string       # Required
publishedAt: string # Required, ISO date (YYYY-MM-DD)
summary: string     # Required
tags: string[]      # Optional, defaults to []
---
```

---

## 10. Commands Reference

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build (validates TypeScript)
pnpm test         # Run Vitest tests
pnpm test:watch   # Vitest in watch mode
pnpm lint         # ESLint
```