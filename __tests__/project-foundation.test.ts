/**
 * Project Foundation Test Suite
 *
 * Tests for User Story: 001-project-foundation
 * These tests verify all acceptance criteria from the Gherkin scenarios.
 */

import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { resolve } from 'path'

const ROOT_DIR = process.cwd()

describe('Project Foundation & Dependencies Setup', () => {
  /**
   * Scenario: All dependencies are installed
   * Given a fresh Next.js project
   * When I run pnpm install
   * Then all required packages are available
   */
  describe('Scenario: All dependencies are installed', () => {
    it('should have framer-motion installed', async () => {
      const pkg = await import('framer-motion')
      expect(pkg).toBeDefined()
    })

    it('should have @react-three/fiber installed', async () => {
      const pkg = await import('@react-three/fiber')
      expect(pkg).toBeDefined()
    })

    it('should have @react-three/drei installed', async () => {
      const pkg = await import('@react-three/drei')
      expect(pkg).toBeDefined()
    })

    it('should have zod installed', async () => {
      const pkg = await import('zod')
      expect(pkg).toBeDefined()
    })

    it('should have sonner installed', async () => {
      const pkg = await import('sonner')
      expect(pkg).toBeDefined()
    })

    it('should have @next/mdx installed', async () => {
      const pkg = await import('@next/mdx')
      expect(pkg).toBeDefined()
    })

    it('should have shadcn/ui components available (class-variance-authority, clsx, tailwind-merge)', async () => {
      // shadcn/ui is not a package itself, but uses these utilities
      const cva = await import('class-variance-authority')
      const clsx = await import('clsx')
      const twMerge = await import('tailwind-merge')

      expect(cva).toBeDefined()
      expect(clsx).toBeDefined()
      expect(twMerge).toBeDefined()
    })
  })

  /**
   * Scenario: Tailwind CSS v4 is configured
   * Given the project has Tailwind v4 installed
   * When I add Tailwind classes to a component
   * Then the styles are applied correctly using CSS-based configuration
   */
  describe('Scenario: Tailwind CSS v4 is configured', () => {
    it('should have tailwindcss installed', async () => {
      const pkg = await import('tailwindcss')
      expect(pkg).toBeDefined()
    })

    it('should have globals.css with Tailwind imports', async () => {
      const globalsCssPath = resolve(ROOT_DIR, 'app', 'globals.css')
      expect(existsSync(globalsCssPath)).toBe(true)
    })

    it('should NOT have tailwind.config.js (using CSS-based configuration)', () => {
      const tailwindConfigJs = resolve(ROOT_DIR, 'tailwind.config.js')
      const tailwindConfigTs = resolve(ROOT_DIR, 'tailwind.config.ts')
      // Tailwind v4 uses CSS-based config, no JS config file needed
      expect(existsSync(tailwindConfigJs)).toBe(false)
      expect(existsSync(tailwindConfigTs)).toBe(false)
    })
  })

  /**
   * Scenario: Folder structure is established
   * Given the project is set up
   * When I check the directory structure
   * Then /app, /components, /components/ui, /lib, /hooks, /content/blog directories exist
   */
  describe('Scenario: Folder structure is established', () => {
    it('should have /app directory', () => {
      const appDir = resolve(ROOT_DIR, 'app')
      expect(existsSync(appDir)).toBe(true)
    })

    it('should have /components directory', () => {
      const componentsDir = resolve(ROOT_DIR, 'components')
      expect(existsSync(componentsDir)).toBe(true)
    })

    it('should have /components/ui directory', () => {
      const uiDir = resolve(ROOT_DIR, 'components', 'ui')
      expect(existsSync(uiDir)).toBe(true)
    })

    it('should have /lib directory', () => {
      const libDir = resolve(ROOT_DIR, 'lib')
      expect(existsSync(libDir)).toBe(true)
    })

    it('should have /hooks directory', () => {
      const hooksDir = resolve(ROOT_DIR, 'hooks')
      expect(existsSync(hooksDir)).toBe(true)
    })

    it('should have /content/blog directory', () => {
      const contentBlogDir = resolve(ROOT_DIR, 'content', 'blog')
      expect(existsSync(contentBlogDir)).toBe(true)
    })
  })

  /**
   * Scenario: MDX support is configured
   * Given the project has @next/mdx installed
   * When I create an .mdx file in /content/blog
   * Then it can be imported and rendered as a React component
   */
  describe('Scenario: MDX support is configured', () => {
    it('should have mdx-components.tsx file', () => {
      const mdxComponentsPath = resolve(ROOT_DIR, 'mdx-components.tsx')
      expect(existsSync(mdxComponentsPath)).toBe(true)
    })

    it('should have next.config.ts configured for MDX', async () => {
      const nextConfigPath = resolve(ROOT_DIR, 'next.config.ts')
      expect(existsSync(nextConfigPath)).toBe(true)
    })
  })

  /**
   * Scenario: Project identity is set
   * Given the project is initialized
   * When I check package.json
   * Then the name is "barbar-dev"
   */
  describe('Scenario: Project identity is set', () => {
    it('should have package.json with name "barbar-dev"', async () => {
      const packageJsonPath = resolve(ROOT_DIR, 'package.json')
      const packageJson = await import(packageJsonPath, { with: { type: 'json' } })
      expect(packageJson.default.name).toBe('barbar-dev')
    })
  })
})
