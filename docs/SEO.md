# barbar.dev SEO playbook

Last reviewed: 2026-08-30

This document records the SEO contract for barbar.dev. Technical SEO helps Google discover and understand the site; it cannot guarantee rankings. The main long-term lever is a focused body of useful, original writing based on Barbar's first-hand engineering and leadership experience.

## Technical contract

- Every indexable page has one descriptive H1, a unique title and description, a self-canonical URL, and crawlable internal links.
- English and German equivalents publish reciprocal `hreflang` links, including self-references and an English `x-default` where an English version exists.
- Published pages appear in `/sitemap.xml`. Article `lastmod` is `updated` when present, otherwise `date`; do not change it for cosmetic edits.
- `/robots.txt` allows production crawling and points to the sitemap.
- The canonical English routes are unprefixed (`/`, `/blog`, and
  `/blog/{slug}`); German routes use `/de`.
- Blog indexes advertise the English feed at `/blog/feed.xml` and the German
  feed at `/de/blog/feed.xml`.
- Article pages publish visible authorship and dates plus `BlogPosting`, `BreadcrumbList`, and—only with accurate upload data—`VideoObject` JSON-LD.
- A post uses its own featured image or YouTube thumbnail for article previews. Do not use the generic site card as an article image when the article has no representative image.
- Legacy `/en` routes redirect directly to their unprefixed equivalents with a
  permanent `308`. URL-case normalization also uses `308`; unknown locales and
  slugs return real 404 responses.
- Google may use large image and unrestricted snippet/video previews through the site-wide robots metadata.

`npm run check:seo` validates the content-side invariants. It runs automatically before `npm run build`.

## Publishing a post

1. Choose a reader problem that fits one of the site's topic clusters and that Barbar can address with first-hand experience.
2. Add the Markdown post under `content/blog/en` or `content/blog/de` using `content/blog/README.md`.
3. Use a concise, specific title and a unique summary. Write the article for the reader rather than for a target word count or keyword density.
4. Show evidence: code, architecture decisions, trade-offs, measurements, mistakes, screenshots, diagrams, or trustworthy citations where appropriate.
5. Add contextual links to useful existing posts. Do not create thin tag/category pages.
6. Use `updated` only after a meaningful change. Add a representative image and alt text when available.
7. Use the same `translationKey` for translated versions. A translation should preserve meaning, not merely translate navigation chrome.
8. Run `npm run check:seo`, `npm run build`, and `npm run lint`.
9. Verify the article HTML, JSON-LD, canonical/hreflang links, sitemap entry, and RSS item before deployment.

## Content strategy

Build depth before breadth. Strong initial clusters based on the site's existing expertise are:

- React, TypeScript, Next.js, React Native, and microfrontend architecture
- .NET, Azure, CI/CD, testing, and production quality
- Fintech and trading-application engineering
- Engineering leadership, mentoring, hiring, communication, and career decisions
- Personal productivity or ADHD where it is grounded in lived experience, especially when connected to engineering work

Use Search Console query and page data to decide what to improve. Avoid scaled generic content, keyword variants that answer the same question, fake freshness, purchased links, and claims unsupported by experience or sources.

## After deployment

These steps require access to the production domain and Google Search Console:

1. Verify a domain property for `barbar.dev`.
2. Submit `https://barbar.dev/sitemap.xml`.
3. Inspect `/`, `/de`, both blog indexes, and new articles; request indexing for important new or substantially updated pages.
4. Monitor Page Indexing, Performance, Enhancements, and Core Web Vitals. The public `site:` operator is not an exhaustive index check.
5. Optionally configure `www.barbar.dev` in DNS and permanently redirect it to the apex domain so mistaken links resolve.
6. Build genuine links through professional profiles, open-source work, technical talks, and relevant communities. Do not buy or exchange manipulative links.

## Primary guidance

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Sitemap and RSS/Atom guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Image SEO](https://developers.google.com/search/docs/appearance/google-images)
- [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Next.js 16 metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js 16 JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
