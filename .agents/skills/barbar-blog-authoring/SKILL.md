---
name: barbar-blog-authoring
description: "Add, edit, translate, review, or publish Markdown blog posts in barbar.dev/content/blog with required frontmatter, people-first SEO, internal links, localized metadata, and validation. Use for content-only blog post work; use barbar-seo-maintenance for routes, layouts, structured data, robots, sitemaps, feeds, or redirects."
---

# Barbar Blog Authoring

Create useful articles for readers first, then make their search presentation accurate and complete.

## Start with the repository contract

1. Work from the barbar.dev repository root.
2. Read the [blog content schema](../../../content/blog/README.md) and the relevant sections of the [SEO playbook](../../../docs/SEO.md).
3. Inspect the nearest related post and any post sharing the same `translationKey` before editing.

## Author the post

1. Define one clear reader problem and search intent. Prefer original experience, concrete examples, screenshots, measurements, or sources that genuinely support the article.
2. Do not keyword-stuff, mass-produce near-duplicate pages, invent expertise or evidence, or promise a ranking.
3. Supply every required frontmatter field. Keep `published` explicit. Keep `translationKey` stable across translations and unique within each locale.
4. Use `updated` only after a meaningful content change. Never change a date merely to make an article look fresh.
5. Pair `featuredImage` with accurate `featuredImageAlt`. Use a representative post image, not the generic site preview. Confirm that the local file exists.
6. When embedding YouTube, record the video's real `youtubeVideoUploadDate`; omit video metadata when the date cannot be verified.
7. Start Markdown sections at `##` because the page template supplies the single visible `h1`. Use descriptive headings and crawlable contextual links where they help the reader.
8. Keep claims, titles, descriptions, slugs, and translations accurate. Do not silently add or publish a translation the user did not request.

## Verify before handing off

Run these commands from the repository root:

```powershell
npm run check:seo
npm run build
npm run lint
```

For every affected published route, verify the rendered title, description, canonical, language alternatives, visible byline and dates, structured data, sitemap entry, and locale RSS item. Treat warnings as review prompts rather than blindly suppressing them.

Do not deploy, modify DNS, or act in Google Search Console unless the user explicitly requests that external action.
