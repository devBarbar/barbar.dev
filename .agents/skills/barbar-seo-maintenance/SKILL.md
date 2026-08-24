---
name: barbar-seo-maintenance
description: "Audit or modify technical SEO in barbar.dev when work touches Next.js routes, layouts, metadata, localization, navigation, structured data, robots, sitemap, RSS, redirects, icons, Core Web Vitals, or blog rendering. Use after structural site changes and for SEO regression reviews; use barbar-blog-authoring for content-only Markdown post work."
---

# Barbar SEO Maintenance

Preserve the site's crawlability, localized signals, search presentation, and factual structured data whenever its implementation changes.

## Establish the current contract

1. Work from the barbar.dev repository root.
2. Read the repository `AGENTS.md` and the [SEO playbook](../../../docs/SEO.md).
3. Before changing Next.js code, locate and read the relevant guide under `node_modules/next/dist/docs/`; this repository's installed Next.js version may differ from remembered APIs.
4. Inspect the live behavior and the current implementation before diagnosing or editing. Use current primary Google Search documentation when guidance may have changed.

## Preserve these invariants

- Each indexable localized page has one absolute self-canonical, accurate language alternatives, and an `x-default` where appropriate.
- Pages render one descriptive visible `h1`, a logical heading hierarchy, crawlable anchor links, indexable HTML, and real `404` responses for missing content.
- Site, person, blog, article, breadcrumb, and video structured data remain factual and consistent with visible content. Serialize JSON-LD through the shared safe component.
- The sitemap includes only canonical published URLs, accurate modification dates, localized alternatives, and no invented freshness signals.
- Each locale feed remains valid RSS, contains the same published posts as the blog, and is discoverable from relevant metadata and the footer.
- Robots directives allow intended public content and preserve large image, snippet, and video previews. Metadata routes and the generated icon remain directly reachable.
- Permanent root and case-normalization redirects remain `308`. Redirects never swallow framework metadata routes or turn missing posts into soft `404`s.
- Article images are representative of that article. Do not substitute the generic site preview as a fake article image.
- Titles, descriptions, bylines, publication dates, update dates, and video metadata match the page a visitor can see.

## Validate proportionally

Always run:

```powershell
npm run check:seo
npm run build
npm run lint
```

Then exercise representative production routes in both locales, including a blog index, an article, feeds, sitemap, robots, icon, redirects, and a missing article. Inspect rendered metadata and JSON-LD rather than trusting source declarations alone.

Run mobile Lighthouse on affected templates after material layout, JavaScript, media, font, or navigation changes. Separate lab variance and third-party warnings from regressions introduced by the repository.

Report what was verified and what still depends on deployment, DNS, Google Search Console, backlinks, or future content. Never guarantee ranking, and do not deploy or change those external systems without explicit user authorization.
