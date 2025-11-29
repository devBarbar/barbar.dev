# Copilot Instructions – barbar.dev Portfolio

## Project Overview
Personal portfolio site for Barbar Ahmad (Lead Software Engineer). Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **shadcn/ui (new-york style)**, and planned **React Three Fiber** for 3D effects.

## Tech Stack & Conventions

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router) | RSC-first, pages in `/app` |
| Styling | Tailwind CSS v4 + CSS variables | Theme colors in `app/globals.css` using `oklch()` |
| Components | shadcn/ui (new-york) | Add via `npx shadcn@latest add <component>` |
| Animations | Framer Motion | Scroll-triggered, page transitions |
| 3D | React Three Fiber + drei | Hero section particles (lazy loaded) |
| Blog | MDX via `@next/mdx` | Content in `/content/blog/`, frontmatter required |
| Forms | Zod validation + Formspree | Toast feedback via `sonner` |
| Theme | next-themes | `class` attribute, localStorage persistence |
| Testing | Vitest + Testing Library | Tests in `/__tests__/`, run with `pnpm test` |

## Key Commands
```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build (validates TypeScript)
pnpm test         # Run Vitest tests
pnpm test:watch   # Vitest in watch mode
pnpm lint         # ESLint
```

## Directory Structure
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

## Component Patterns

### Client vs Server Components
- Default to **Server Components** (no directive needed)
- Add `"use client"` only when using hooks, browser APIs, or interactivity
- See [theme-toggle.tsx](components/theme-toggle.tsx) for client component pattern

### Styling with Tailwind
- Use `cn()` from `@/lib/utils` to merge conditional classes:
  ```tsx
  import { cn } from "@/lib/utils"
  <div className={cn("base-class", condition && "conditional-class")} />
  ```
- Dark mode: use `dark:` variant (theme via `class` on `<html>`)
- Theme colors: reference CSS variables (`bg-background`, `text-foreground`, etc.)

### Adding shadcn/ui Components
```bash
npx shadcn@latest add button dialog tooltip
```
Components install to `/components/ui/`. Customize variants in place.

## Theme System
- Provider in [layout.tsx](app/layout.tsx) wrapping app with `ThemeProvider`
- Toggle in [theme-toggle.tsx](components/theme-toggle.tsx) – handles hydration with `mounted` state
- 1-second CSS transition on theme change (see `globals.css`)
- Always use `resolvedTheme` for dark/light checks, not `theme`

## MDX Blog Posts
Create in `/content/blog/` with required frontmatter:
```mdx
---
title: "Post Title"
publishedAt: "2025-11-30"
summary: "Brief description"
tags: ["react", "nextjs"]  # optional
---

Content here...
```
Custom MDX components defined in [mdx-components.tsx](mdx-components.tsx).

## Testing Patterns
- Tests follow **Gherkin-style** naming: `"Given X, When Y, Then Z"`
- Wrap components needing theme in `ThemeProvider` test wrapper
- Mock `matchMedia` for theme tests (see [theme-toggle.test.tsx](__tests__/theme-toggle.test.tsx))

## Accessibility Requirements
- Touch targets: minimum 44×44px on mobile
- Theme toggle: proper `aria-label` indicating action ("Switch to dark/light mode")
- Loading states: use `aria-busy` during hydration
- Reduce motion: respect `prefers-reduced-motion` (transitions disabled in CSS)

## Performance Constraints (from specs)
- Lighthouse target: >80 on all metrics
- 3D canvas: lazy load, degrade gracefully if WebGL unavailable
- No main thread blocking >50ms from 3D animations
- Custom cursor: hide on touch devices (`pointer: coarse` media query)

## Path Aliases
Configured in `tsconfig.json`:
```
@/* → ./*  (project root)
```
Use `@/components`, `@/lib/utils`, `@/hooks`, etc.
