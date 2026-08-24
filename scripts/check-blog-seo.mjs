import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "content", "blog");
const publicRoot = path.join(projectRoot, "public");
const locales = ["en", "de"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;
const failures = [];
const warnings = [];
let publishedCount = 0;

function isValidDate(value) {
  if (typeof value !== "string" || !datePattern.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function addFailure(file, message) {
  failures.push(`${path.relative(projectRoot, file)}: ${message}`);
}

function addWarning(file, message) {
  warnings.push(`${path.relative(projectRoot, file)}: ${message}`);
}

for (const locale of locales) {
  const localeDirectory = path.join(contentRoot, locale);
  const seenTitles = new Map();
  const seenDescriptions = new Map();
  const seenTranslationKeys = new Map();

  if (!fs.existsSync(localeDirectory)) {
    failures.push(`content/blog/${locale}: locale directory is missing`);
    continue;
  }

  const files = fs
    .readdirSync(localeDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(localeDirectory, entry.name));

  for (const file of files) {
    const slug = path.basename(file, ".md");
    const source = fs.readFileSync(file, "utf8");
    const { data, content } = matter(source);

    if (!slugPattern.test(slug)) {
      addFailure(file, "filename must be a lowercase kebab-case URL slug");
    }

    if (typeof data.published !== "boolean") {
      addFailure(file, "published must be set explicitly to true or false");
    }

    if (typeof data.title !== "string" || data.title.trim().length === 0 || data.title.length > 120) {
      addFailure(file, "title must contain 1-120 characters");
    }

    if (
      typeof data.description !== "string" ||
      data.description.trim().length === 0 ||
      data.description.length > 220
    ) {
      addFailure(file, "description must contain 1-220 characters");
    } else if (data.description.length < 70 || data.description.length > 180) {
      addWarning(file, "description is usually most useful at roughly 70-180 characters");
    }

    if (!isValidDate(data.date)) {
      addFailure(file, "date must be a real YYYY-MM-DD date");
    }

    if (data.updated !== undefined) {
      if (!isValidDate(data.updated)) {
        addFailure(file, "updated must be a real YYYY-MM-DD date");
      } else if (isValidDate(data.date) && data.updated < data.date) {
        addFailure(file, "updated cannot be earlier than date");
      }
    }

    if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      addFailure(file, "tags must be a list of non-empty strings");
    }

    if (!content.trim()) {
      addFailure(file, "article body is empty");
    }

    if (/^#\s+/m.test(content)) {
      addFailure(file, "the page title supplies H1; start article headings at ##");
    }

    if (data.translationKey !== undefined && !slugPattern.test(data.translationKey)) {
      addFailure(file, "translationKey must be lowercase kebab-case");
    }

    const hasFeaturedImage = typeof data.featuredImage === "string" && data.featuredImage.length > 0;
    const hasFeaturedImageAlt =
      typeof data.featuredImageAlt === "string" && data.featuredImageAlt.trim().length > 0;

    if (hasFeaturedImage !== hasFeaturedImageAlt) {
      addFailure(file, "featuredImage and featuredImageAlt must be provided together");
    }

    if (hasFeaturedImage) {
      if (!/^\/(?!\/)/.test(data.featuredImage)) {
        addFailure(file, "featuredImage must be a root-relative path inside public/");
      } else {
        const imagePath = path.resolve(publicRoot, data.featuredImage.slice(1));
        const relativeImagePath = path.relative(publicRoot, imagePath);

        if (relativeImagePath.startsWith("..") || path.isAbsolute(relativeImagePath)) {
          addFailure(file, "featuredImage resolves outside public/");
        } else if (!fs.existsSync(imagePath)) {
          addFailure(file, `featuredImage does not exist: ${data.featuredImage}`);
        }
      }
    }

    if (data.youtubeVideoId !== undefined && !videoIdPattern.test(data.youtubeVideoId)) {
      addFailure(file, "youtubeVideoId must be an 11-character YouTube video ID");
    }

    if (data.youtubeVideoUploadDate !== undefined) {
      if (!data.youtubeVideoId) {
        addFailure(file, "youtubeVideoUploadDate requires youtubeVideoId");
      }

      if (!isValidDate(data.youtubeVideoUploadDate)) {
        addFailure(file, "youtubeVideoUploadDate must be a real YYYY-MM-DD date");
      }
    } else if (data.youtubeVideoId) {
      addWarning(file, "video structured data is omitted until youtubeVideoUploadDate is set accurately");
    }

    if (data.published !== true) continue;

    publishedCount += 1;
    const translationKey = data.translationKey ?? slug;

    for (const [value, label, seen] of [
      [data.title, "title", seenTitles],
      [data.description, "description", seenDescriptions],
      [translationKey, "translationKey", seenTranslationKeys],
    ]) {
      if (typeof value !== "string") continue;

      const existing = seen.get(value);
      if (existing) {
        addFailure(file, `${label} duplicates ${path.relative(projectRoot, existing)}`);
      } else {
        seen.set(value, file);
      }
    }
  }
}

for (const warning of warnings) {
  console.warn(`SEO warning: ${warning}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`SEO error: ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(`SEO content check passed for ${publishedCount} published localized posts.`);
}
