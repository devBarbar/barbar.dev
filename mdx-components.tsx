import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

/**
 * Custom MDX components for rendering MDX content.
 * This file is required for @next/mdx to work with the App Router.
 *
 * You can customize how markdown elements are rendered by
 * mapping component names to your custom React components.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize heading styles
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-4xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-3xl font-semibold mb-3">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-2xl font-medium mb-2">{children}</h3>
    ),
    // Customize paragraph
    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-base leading-relaxed mb-4">{children}</p>
    ),
    // Customize code blocks
    pre: ({ children }: { children?: ReactNode }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    code: ({ children }: { children?: ReactNode }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    ),
    // Customize links
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    // Allow custom components to be passed in
    ...components,
  }
}
