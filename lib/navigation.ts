/**
 * Navigation configuration for the portfolio site
 *
 * Defines all navigation items with their labels, hrefs, and types.
 * - "route" type: Full page navigation (e.g., /blog)
 * - "anchor" type: Same-page anchor or cross-page anchor (e.g., /#contact)
 */

export interface NavItem {
  /** Display label for the navigation link */
  label: string;
  /** URL or anchor href */
  href: string;
  /** Type of navigation: route (page) or anchor (section) */
  type: "route" | "anchor";
}

/**
 * Main navigation items for the header
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", type: "route" },
  { label: "Projects", href: "/#projects", type: "anchor" },
  { label: "Blog", href: "/blog", type: "route" },
  { label: "Contact", href: "/#contact", type: "anchor" },
];
