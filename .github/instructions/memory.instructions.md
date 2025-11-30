---
applyTo: '**'
---

# 🧠 Project Memory & AI Instructions
> **System Context for AI Agents**  
> *File:* `.github/instructions/memory.instructions.md`  
> *Last Updated:* 2025-11-30 (Story 009 Complete)

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
| **Lenis** | Smooth scroll library wrapping the app for buttery scroll experience |
| **AnimatedSection** | Reusable scroll-triggered animation wrapper component |
| **Stagger Animation** | Child elements animate sequentially with 100ms delay between each |
| **Viewport Trigger** | Animation triggers when 15% of element is visible (amount: 0.15) |
| **Reduced Motion** | OS preference (`prefers-reduced-motion`) – disables all animations |
| **NavItem** | Navigation configuration object with `label`, `href`, and `type` properties |
| **Route Link** | Navigation to a full page (e.g., `/blog`) – type: `"route"` |
| **Anchor Link** | Navigation to a section on homepage (e.g., `/#contact`) – type: `"anchor"` |
| **Skip Link** | Accessibility link to bypass navigation and jump to main content |
| **Mobile Menu** | Full-screen overlay navigation for mobile devices with staggered reveal |
| **Focus Trap** | Keeps keyboard focus within the mobile menu when open |
| **Project** | Data model with `slug`, `name`, `type`, `description`, `techStack`, and `thumbnail` fields |
| **ProjectDetail** | Extended Project with `fullDescription`, detailed `techStack`, `features`, `challenges`, and `screenshots` |
| **TechStackItem** | Object with `name` and `explanation` for tech badges with tooltips |
| **Feature** | Object with `title` and `description` for project feature cards |
| **Challenge** | Object with `problem` and `solution` for problem/solution cards |
| **Case Study Page** | Dynamic route at `/projects/[slug]` displaying full project details |
| **ProjectCard** | Reusable component displaying project thumbnail, type, name, description, and tech stack badges |
| **ProjectsSection** | Homepage section containing 3 featured project cards with stagger animation |
| **Ripple Effect** | CSS animation emanating from click point on project cards |

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
| Smooth Scroll | Lenis | Wraps app, respects reduced motion, anchor navigation |
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
/app                       → Next.js App Router pages & layouts
/app/projects/[slug]       → Dynamic project case study pages
/components                → React components (client/server)
/components/ui             → shadcn/ui primitives (Button, Badge, Skeleton, Tooltip, etc.)
/components/hero           → Hero section components (canvas, particles, scene)
/lib                       → Utilities + data (cn(), projects, navigation)
/hooks                     → Custom React hooks
/content/blog              → MDX blog posts with frontmatter
/__tests__                 → Vitest test files
/.specs                    → Feature specs & acceptance criteria (reference only)
/public/images/projects    → Project thumbnails and screenshots (SVG placeholders)
```

---

## 5. Feature Registry (Index)

| ID | Feature | Status | Summary |
|:---|:--------|:-------|:--------|
| 001 | Project Foundation & Dependencies | 🧪 QA | Next.js, Tailwind v4, shadcn/ui, MDX setup |
| 002 | Theme System (Dark/Light Mode) | ✅ Done | next-themes, 1s transitions, FOUC prevention |
| 003 | Custom Cursor Component | ✅ Done | Desktop only, hidden on touch devices, spring animation |
| 004 | 3D Hero Section | ✅ Done | R3F particles, adaptive performance, theme colors |
| 005 | Smooth Scroll & Animations | 🧪 QA | Lenis smooth scroll, Framer Motion scroll-triggered |
| 006 | Navigation & Layout Shell | ✅ Done | Header, nav links, mobile hamburger, skip link, focus trap |
| 007 | Hero Content & Typography | 📋 Draft | Name, title, CTA button |
| 008 | Projects Section (Homepage) | 🧪 QA | 3 project cards with hover effects, stagger animation, ripple click |
| 009 | Project Case Study Pages | 🧪 QA | `/projects/[slug]` detail pages with hero, tech stack, features, challenges, screenshots |
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

## 10. Component Patterns

### ProjectCard Pattern
- Wraps entire card in `<Link>` for full clickable area
- Integrates `<CursorTarget>` for custom cursor hover state
- Uses `<Skeleton>` for image loading state with fade-in transition
- Displays tech stack with `<Badge>` components (flex-wrap)
- Supports ripple effect on click via CSS animation
- Focus ring via `focus-visible:ring-2 focus-visible:ring-primary`

### Stagger Animation Pattern (Framer Motion)
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

### Image Loading State Pattern
```tsx
const [imageLoaded, setImageLoaded] = useState(false);
{!imageLoaded && <Skeleton className="absolute inset-0" />}
<Image onLoad={() => setImageLoaded(true)} className={cn(imageLoaded ? "opacity-100" : "opacity-0")} />
```

### Case Study Page Pattern (Story 009)
- **BackButton:** Client component with `history.back()`, 44×44px touch target
- **TechStackItem:** Badge wrapped in Tooltip for explanation on hover
- **ProjectHero:** 16:9 aspect ratio hero image with Skeleton loading state
- **FeatureCard:** Simple title + description card with subtle border
- **ChallengeCard:** Two-section card: problem (red accent) / solution (green accent)
- **ScreenshotGallery:** Responsive grid (1/2/3 columns) with staggered child animation
- **ProjectPageContent:** Full page layout composing all above components

### Dynamic Route Generation Pattern
```tsx
// Static params for all project slugs
export function generateStaticParams() {
  return projectDetails.map((project) => ({ slug: project.slug }));
}

// SEO metadata with OG image
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectDetail(params.slug);
  return {
    title: project?.name,
    description: project?.description,
    openGraph: { images: [project?.thumbnail] },
  };
}
```

---

## 11. Commands Reference

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build (validates TypeScript)
pnpm test         # Run Vitest tests
pnpm test:watch   # Vitest in watch mode
pnpm lint         # ESLint
```

---

## 12. New Files Added (Feature 008)

| File | Purpose |
|:-----|:--------|
| `/lib/projects.ts` | Project data model interface and featured projects array |
| `/components/project-card.tsx` | Individual project card with CursorTarget, Skeleton, ripple |
| `/components/projects-section.tsx` | Section container with AnimatedSection + stagger animation |
| `/components/ui/badge.tsx` | shadcn/ui Badge component for tech stack tags |
| `/components/ui/skeleton.tsx` | shadcn/ui Skeleton component for loading states |
| `/__tests__/projects-section.test.tsx` | 19 tests covering data model, rendering, a11y, responsiveness |

---

## 13. New Files Added (Feature 009)

| File | Purpose |
|:-----|:--------|
| `/app/projects/[slug]/page.tsx` | Dynamic case study page with `generateStaticParams`, `generateMetadata`, `notFound()` |
| `/components/back-button.tsx` | ArrowLeft button triggering `history.back()`, 44×44px touch target |
| `/components/tech-stack-item.tsx` | Badge + Tooltip wrapper for tech explanations |
| `/components/project-hero.tsx` | Full-width 16:9 hero image with Skeleton loading |
| `/components/feature-card.tsx` | Card displaying feature title + description |
| `/components/challenge-card.tsx` | Card with problem (red) / solution (green) sections |
| `/components/screenshot-gallery.tsx` | Responsive 1/2/3 column grid with stagger animation |
| `/components/project-page-content.tsx` | Full case study layout composing all sections |
| `/components/ui/tooltip.tsx` | shadcn/ui Tooltip component for tech stack explanations |
| `/__tests__/project-case-study.test.tsx` | 18 tests covering routing, SEO, components, a11y |
| `/public/images/projects/*.svg` | Placeholder thumbnails and screenshots for all 3 projects |

---

## 14. Data Model Extensions (Feature 009)

### TechStackItem Interface
```typescript
interface TechStackItem {
  name: string;        // Display name on badge
  explanation: string; // Tooltip content
}
```

### Feature Interface
```typescript
interface Feature {
  title: string;       // Feature name
  description: string; // What it does
}
```

### Challenge Interface
```typescript
interface Challenge {
  problem: string;     // The difficulty faced
  solution: string;    // How it was solved
}
```

### ProjectDetail Interface
```typescript
interface ProjectDetail extends Project {
  fullDescription: string;      // Extended description for case study
  techStack: TechStackItem[];   // Detailed tech with explanations
  features: Feature[];          // List of key features
  challenges: Challenge[];      // Problem/solution pairs
  screenshots: string[];        // Array of screenshot paths
}
```

### API Functions
```typescript
getProjectDetail(slug: string): ProjectDetail | undefined
projectDetails: ProjectDetail[]  // All detailed project data
```