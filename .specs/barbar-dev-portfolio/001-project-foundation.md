**Status:** READY FOR QA
**Date:** 2025-11-29

## Prerequisites
| ID | Title | Status |
| :--- | :--- | :--- |
| | | |

## Title
Project Foundation & Dependencies Setup

## Description
**User Story:**
As a developer, I want to set up the project foundation with all required dependencies, so that I have a solid base to build features upon.

**Context:**
Initialize the Next.js App Router project with all required packages: React Three Fiber, Framer Motion, Tailwind CSS v4, zod, sonner, shadcn/ui, and MDX support. Configure TypeScript and establish the base folder structure.

## Acceptance Criteria (Gherkin)
```gherkin
Scenario: All dependencies are installed
  Given a fresh Next.js project
  When I run pnpm install
  Then all required packages are available (framer-motion, @react-three/fiber, @react-three/drei, zod, sonner, @next/mdx, shadcn/ui)

Scenario: Tailwind CSS v4 is configured
  Given the project has Tailwind v4 installed
  When I add Tailwind classes to a component
  Then the styles are applied correctly using CSS-based configuration

Scenario: TypeScript compiles without errors
  Given the project has TypeScript configured
  When I run pnpm build
  Then there are no TypeScript errors

Scenario: Folder structure is established
  Given the project is set up
  When I check the directory structure
  Then /app, /components, /components/ui, /lib, /hooks, /content/blog directories exist

Scenario: MDX support is configured
  Given the project has @next/mdx installed
  When I create an .mdx file in /content/blog
  Then it can be imported and rendered as a React component

Scenario: Project identity is set
  Given the project is initialized
  When I check package.json
  Then the name is "barbar-dev"
```

## Technical Notes
- Uses Tailwind CSS v4 with CSS-based configuration (no tailwind.config.js)
- shadcn/ui initialized with "new-york" style
- React 19 compatibility verified for @react-three/fiber and @react-three/drei
- MDX configured via @next/mdx with mdx-components.tsx for custom component mapping
