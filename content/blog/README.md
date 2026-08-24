# Blog authoring

Add English posts to `content/blog/en` and German posts to `content/blog/de`. The filename becomes the URL slug, so use lowercase kebab-case such as `my-new-post.md`.

Use this front matter at the top of every post:

```md
---
title: "My post title"
description: "A short summary used on the blog index and by search engines."
date: "2026-08-23"
updated: "2026-08-24"
tags:
  - Next.js
  - TypeScript
published: true
translationKey: "shared-post-id"
featuredImage: "/blog/my-post/cover.jpg"
featuredImageAlt: "A descriptive explanation of the article image."
youtubeVideoId: "abc123DEF_-"
youtubeVideoUploadDate: "2026-08-23"
---

Write the article in Markdown here.
```

The front-matter title is the page's main heading, so start headings inside the article at `##`. If a body contains `#`, the renderer safely displays it as a second-level heading.

The next build discovers published files automatically. Always set `published` explicitly; use `false` to keep a draft out of the site. `translationKey` is optional; use the same value in translated posts when their localized filenames differ.

Only add `updated` after a meaningful change to the article, and never set it earlier than `date`. Featured images must live in `public/`, be referenced with a root-relative path, and include useful alt text. Add a YouTube video's 11-character ID as `youtubeVideoId` to embed it above the article. When its real upload date is known, add `youtubeVideoUploadDate` so the page can emit accurate video structured data. If no translation exists, the language switcher opens the other language's blog index instead of a missing page.
