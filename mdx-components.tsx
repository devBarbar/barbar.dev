import type { MDXComponents } from 'mdx/types'
import type { ReactNode, HTMLAttributes, AnchorHTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Custom MDX components for rendering MDX content.
 * This file is required for @next/mdx to work with the App Router.
 *
 * All components use CSS variables for theme compatibility.
 * Styling follows the UI spec for blog post detail pages.
 */

// Helper to generate heading IDs from text content
function generateId(children: ReactNode): string {
  if (typeof children === 'string') {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return ''
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ========================================================================
    // HEADINGS - Responsive sizes with proper margins, auto-generated IDs
    // ========================================================================
    h1: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 
        id={generateId(children)}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-8 mb-4 scroll-mt-24"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 
        id={generateId(children)}
        className="text-2xl md:text-3xl font-semibold text-foreground mt-8 mb-4 scroll-mt-24"
        tabIndex={-1}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 
        id={generateId(children)}
        className="text-xl md:text-2xl font-medium text-foreground mt-6 mb-3 scroll-mt-24"
        tabIndex={-1}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h4 
        id={generateId(children)}
        className="text-lg md:text-xl font-medium text-foreground mt-6 mb-2 scroll-mt-24"
        tabIndex={-1}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h5 
        className="text-base md:text-lg font-medium text-foreground mt-4 mb-2"
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h6 
        className="text-sm md:text-base font-medium text-foreground mt-4 mb-2"
        {...props}
      >
        {children}
      </h6>
    ),

    // ========================================================================
    // PARAGRAPH - Leading relaxed with proper spacing
    // ========================================================================
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <p 
        className="text-base md:text-lg leading-relaxed text-foreground mb-6"
        {...props}
      >
        {children}
      </p>
    ),

    // ========================================================================
    // CODE BLOCKS - Theme-aware, handled by rehype-pretty-code
    // ========================================================================
    pre: ({ children, className, ...props }: HTMLAttributes<HTMLPreElement>) => (
      <pre 
        className={cn(
          "rounded-lg overflow-x-auto mb-6 p-4",
          "bg-muted/50 border border-border",
          // rehype-pretty-code will add data attributes for styling
          className
        )}
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
      // Check if this is an inline code (not inside a pre block)
      const isInlineCode = !className?.includes('language-')
      
      if (isInlineCode) {
        return (
          <code 
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
            {...props}
          >
            {children}
          </code>
        )
      }
      
      // Block code - styling handled by rehype-pretty-code
      return (
        <code className={cn("text-sm", className)} {...props}>
          {children}
        </code>
      )
    },

    // ========================================================================
    // LINKS - Primary color with underline, external link handling
    // ========================================================================
    a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && (
            <span className="sr-only"> (opens in new tab)</span>
          )}
        </a>
      )
    },

    // ========================================================================
    // LISTS - Proper indentation and markers
    // ========================================================================
    ul: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul 
        className="list-disc list-outside ml-6 mb-6 space-y-2 text-foreground"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: HTMLAttributes<HTMLOListElement>) => (
      <ol 
        className="list-decimal list-outside ml-6 mb-6 space-y-2 text-foreground"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => (
      <li 
        className="text-base md:text-lg leading-relaxed pl-2"
        {...props}
      >
        {children}
      </li>
    ),

    // ========================================================================
    // BLOCKQUOTE - Left border, italic, muted text
    // ========================================================================
    blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote 
        className="border-l-4 border-muted-foreground/30 pl-6 py-2 my-6 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // ========================================================================
    // TABLE - Bordered, responsive, alternating rows
    // ========================================================================
    table: ({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto mb-6">
        <table 
          className="w-full border-collapse border border-border text-foreground"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
      <tr 
        className="border-b border-border even:bg-muted/30"
        {...props}
      >
        {children}
      </tr>
    ),
    th: ({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th 
        className="px-4 py-3 text-left font-semibold text-foreground border border-border"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td 
        className="px-4 py-3 text-foreground border border-border"
        {...props}
      >
        {children}
      </td>
    ),

    // ========================================================================
    // HORIZONTAL RULE - Subtle divider with spacing
    // ========================================================================
    hr: (props: HTMLAttributes<HTMLHRElement>) => (
      <hr 
        className="my-8 border-t border-border"
        {...props}
      />
    ),

    // ========================================================================
    // IMAGE - Responsive with rounded corners
    // ========================================================================
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ''}
          className="rounded-lg w-full h-auto"
          loading="lazy"
          {...props}
        />
        {alt && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // ========================================================================
    // STRONG & EM - Proper text styling
    // ========================================================================
    strong: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
      <strong className="font-bold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),

    // Allow custom components to be passed in
    ...components,
  }
}
