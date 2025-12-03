---
applyTo: '**'
---

# 🧠 Project Memory (Optimized)
> **Context:** `.github/instructions/memory.instructions.md`

---

## 1. Core Vision

* **Goal:** Award-caliber portfolio for Barbar Ahmad → attract employers, Awwwards nomination
* **Launch:** November 30, 2025
* **Metrics:** 5+ recruiter inquiries (30d), 500+ visitors (30d), Lighthouse >80 all

---

## 2. Global Glossary

| Term | Definition |
|:-----|:-----------|
| **RSC** | React Server Components (default, no directive) |
| **Client Component** | Requires `"use client"` for hooks/browser APIs |
| **FOUC** | Flash of Unstyled Content – prevented via `next-themes` blocking script |
| **Reduced Motion** | `prefers-reduced-motion` – disables all animations |
| **Touch Device** | `pointer: coarse` – custom cursor hidden |
| **Stagger Animation** | Children animate sequentially (100ms delay, 15% viewport trigger) |
| **Frontmatter** | MDX metadata: `title`, `publishedAt`, `summary`, `tags[]` |
| **Demand Rendering** | R3F `frameloop="demand"` – only re-renders on `invalidate()` call |
| **Ref-based Updates** | Use refs (not state) for high-frequency data (mouse, FPS) to avoid reconciliation |

---

## 3. Tech Stack & Patterns

| Layer | Stack | Pattern/Notes |
|:------|:------|:--------------|
| **Framework** | Next.js 16 (App Router) | RSC-first, pages in `/app` |
| **Styling** | Tailwind v4 + CSS vars | `oklch()` colors, `cn()` for class merging |
| **Components** | shadcn/ui (new-york) | `npx shadcn@latest add <component>` |
| **3D** | React Three Fiber + drei | Lazy loaded, WebGL fallback, demand rendering, adaptive FPS |
| **Animations** | Framer Motion + Lenis | Scroll-triggered, smooth scroll, anchor nav |
| **Blog** | MDX via `@next/mdx` | `/content/blog/`, frontmatter required |
| **Forms** | Zod + Formspree | Toast via `sonner`, mailto fallback |
| **Theme** | next-themes | `class` attr, localStorage, 1s transitions |
| **Testing** | Vitest + Testing Library | Gherkin-style: `"Given X, When Y, Then Z"` |

---

## 4. Architecture

### Routes
```
/                  → Homepage (Hero, Projects, About, Contact)
/blog              → Blog listing
/blog/[slug]       → Blog post
/projects/[slug]   → Case study
```

### Directory Structure
```
/app              → Pages & layouts
/components       → React components (+ /ui for shadcn, /hero for 3D)
/lib              → Utilities & data (cn, projects, navigation, about)
/hooks            → Custom hooks
/content/blog     → MDX posts
/__tests__        → Vitest tests
```

### Data Models
| Entity | Location | Key Fields |
|:-------|:---------|:-----------|
| **Project** | `/lib/projects.ts` | `slug`, `name`, `type`, `techStack[]`, `thumbnail` |
| **ProjectDetail** | `/lib/projects.ts` | extends Project + `features[]`, `challenges[]`, `screenshots[]` |
| **AboutData** | `/lib/about.ts` | `achievements[]`, `experience[]`, `education[]`, `skills[]` |
| **BlogPost** | `/content/blog/*.mdx` | frontmatter: title, publishedAt, summary, tags |

---

## 5. Feature Index

| ID | Feature | Status |
|:---|:--------|:-------|
| 001 | Foundation & Dependencies | 🧪 QA |
| 002 | Theme System | ✅ Done |
| 003 | Custom Cursor | ✅ Done |
| 004 | 3D Hero | ✅ Done |
| 005 | Smooth Scroll & Animations | 🧪 QA |
| 006 | Navigation & Layout | ✅ Done |
| 007 | Hero Content | 📋 Draft |
| 008 | Projects Section | 🧪 QA |
| 009 | Case Study Pages | 🧪 QA |
| 010 | About/CV Section | 🧪 QA |
| 011-014 | Blog (MDX, listing, detail, first post) | 📋 Draft |
| 015-016 | Contact Form (UI, submission) | 📋 Draft |
| 017-019 | Polish (responsive, perf, deploy) | 📋 Draft |

---

## 6. Immutable Constraints

### Performance
* Lighthouse >80 all metrics (desktop + mobile)
* 3D canvas: lazy load, <50ms main thread, 50% particle reduction when FPS <30
* DPR limited to [1, 2] – prevents excessive GPU work on high-DPI displays
* Bloom disabled on Chrome desktop – Chrome WebGL has paint perf issues
* State update throttling (500ms) for animation loops – prevents reconciliation spam

### Accessibility
* Touch targets: min 44×44px
* Focus: visible `ring-2` on interactive elements
* Reduced motion: respect OS preference (disable transitions)
* Keyboard: all elements focusable and operable

### Theme
* localStorage persistence via next-themes
* 1s `ease-in-out` transitions
* FOUC prevention: `suppressHydrationWarning` on `<html>`

### Responsive
* Mobile-first, min 320px viewport
* Breakpoints: mobile <640px, tablet 640px+, desktop 1024px+

### Security
* HTTPS required (barbar.dev)
* Form sanitization (XSS prevention)
* No custom backend – Formspree only

---

## 7. Key Patterns

### Animation (Framer Motion)
```tsx
// Container: staggerChildren: 0.1
// Item: { opacity: 0, y: 20 } → { opacity: 1, y: 0 }
```

### Image Loading
```tsx
// Skeleton overlay until onLoad, then fade-in transition
```

### Dynamic Routes
```tsx
// generateStaticParams() for static paths
// generateMetadata() for SEO + OG images
```

### R3F Performance (Critical)
```tsx
// Use frameloop="demand" + invalidate() for controlled rendering
// Use refs for high-frequency data (mouse, FPS) – never setState in useFrame
// Throttle React state updates to 500ms intervals
// Cap animation deltaTime to prevent large jumps after frame drops
// Browser detection for targeted optimizations (detectBrowser() in lib/utils)
```

---

## 8. Commands

```bash
pnpm dev       # Dev server :3000
pnpm build     # Production build
pnpm test      # Run tests
pnpm lint      # ESLint
```

---

## 9. Contact

* **Owner:** Barbar Ahmad – contact@barbar.dev
* **LinkedIn:** linkedin.com/in/barbar-ahmad
* **Domain:** barbar.dev ✅