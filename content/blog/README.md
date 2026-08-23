# Blog authoring

Add English posts to `content/blog/en` and German posts to `content/blog/de`. The filename becomes the URL slug, so use lowercase kebab-case such as `my-new-post.md`.

Use this front matter at the top of every post:

```md
---
title: "My post title"
description: "A short summary used on the blog index and by search engines."
date: "2026-08-23"
tags:
  - Next.js
  - TypeScript
published: true
translationKey: "shared-post-id"
youtubeVideoId: "abc123DEF_-"
---

Write the article in Markdown here.
```

The front-matter title is the page's main heading, so start headings inside the article at `##`. If a body contains `#`, the renderer safely displays it as a second-level heading.

The next build discovers published files automatically. Set `published: false` to keep a draft out of the site. `translationKey` is optional; use the same value in translated posts when their localized filenames differ. Add a YouTube video's 11-character ID as `youtubeVideoId` to embed it above the article. If no translation exists, the language switcher opens the other language's blog index instead of a missing page.
