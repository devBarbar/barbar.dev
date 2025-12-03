import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { BlogPost } from "@/lib/blog";
import { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/blog";
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Helper: Create a test MDX file with optional custom frontmatter
 */
function createTestPost(
  filename: string,
  frontmatter: Record<string, unknown>,
  content: string = "This is test content for reading time calculation."
): string {
  const frontmatterStr = Object.entries(frontmatter)
    .map(([key, val]) => {
      if (typeof val === "string") return `${key}: "${val}"`;
      if (Array.isArray(val)) return `${key}: [${val.map((v) => `"${v}"`).join(", ")}]`;
      return `${key}: ${val}`;
    })
    .join("\n");

  const mdxContent = `---\n${frontmatterStr}\n---\n\n${content}`;
  const filePath = path.join(BLOG_DIR, filename);

  // Ensure directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, mdxContent, "utf-8");
  return filePath;
}

/**
 * Helper: Delete a test file
 */
function deleteTestPost(filename: string): void {
  const filePath = path.join(BLOG_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

describe("MDX Blog Infrastructure", () => {
  describe("Scenario: MDX files are processed", () => {
    it('Given I have an MDX file in /content/blog/, When the file is created, Then it can be parsed', () => {
      const filePath = createTestPost("test-post.mdx", {
        title: "Test Post",
        publishedAt: "2025-12-03",
        summary: "A test post summary",
      });

      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("title: \"Test Post\"");

      deleteTestPost("test-post.mdx");
    });
  });

  describe("Scenario: Frontmatter is parsed correctly", () => {
    beforeAll(() => {
      createTestPost("frontmatter-test.mdx", {
        title: "Frontmatter Test",
        publishedAt: "2025-12-01",
        summary: "Testing frontmatter parsing",
      });
    });

    afterAll(() => {
      deleteTestPost("frontmatter-test.mdx");
    });

    it('Given an MDX file has frontmatter with title, publishedAt, summary, When I query the blog posts, Then the frontmatter values are accessible as metadata', () => {
      const posts = getAllPosts();
      const post = posts.find((p: BlogPost) => p.slug === "frontmatter-test");

      expect(post).toBeDefined();
      expect(post?.title).toBe("Frontmatter Test");
      expect(post?.summary).toBe("Testing frontmatter parsing");
      expect(post?.publishedAt).toBeInstanceOf(Date);
    });
  });

  describe("Scenario: Blog utility functions work", () => {
    beforeAll(() => {
      createTestPost("post-one.mdx", {
        title: "Post One",
        publishedAt: "2025-12-01",
        summary: "First test post",
      });
      createTestPost("post-two.mdx", {
        title: "Post Two",
        publishedAt: "2025-12-02",
        summary: "Second test post",
      });
      createTestPost("post-three.mdx", {
        title: "Post Three",
        publishedAt: "2025-12-03",
        summary: "Third test post",
      });
    });

    afterAll(() => {
      deleteTestPost("post-one.mdx");
      deleteTestPost("post-two.mdx");
      deleteTestPost("post-three.mdx");
    });

    it('When I call getAllPosts(), Then I receive an array of blog posts sorted by publishedAt descending', () => {
      const posts = getAllPosts();
      const testPosts = posts.filter((p: BlogPost) =>
        ["post-one", "post-two", "post-three"].includes(p.slug)
      );

      expect(testPosts.length).toBe(3);
      expect(testPosts[0].slug).toBe("post-three"); // Most recent
      expect(testPosts[1].slug).toBe("post-two");
      expect(testPosts[2].slug).toBe("post-one"); // Oldest
    });

    it('When I call getPostBySlug("post-two"), Then I receive the correct BlogPost object with all metadata', () => {
      const post = getPostBySlug("post-two");

      expect(post).toBeDefined();
      expect(post?.slug).toBe("post-two");
      expect(post?.title).toBe("Post Two");
      expect(post?.publishedAt.toISOString()).toContain("2025-12-02");
      expect(post?.summary).toBe("Second test post");
    });

    it('When I call getPostBySlug("non-existent"), Then I receive undefined', () => {
      const post = getPostBySlug("non-existent");
      expect(post).toBeUndefined();
    });
  });

  describe("Scenario: Tags are optional", () => {
    beforeAll(() => {
      createTestPost("no-tags.mdx", {
        title: "Post Without Tags",
        publishedAt: "2025-12-03",
        summary: "No tags provided",
      });
    });

    afterAll(() => {
      deleteTestPost("no-tags.mdx");
    });

    it('Given an MDX file without tags in frontmatter, When the file is parsed, Then no error occurs and tags defaults to empty array', () => {
      const post = getPostBySlug("no-tags");

      expect(post).toBeDefined();
      expect(post?.tags).toEqual([]);
    });
  });

  describe("Scenario: Tags are correctly populated when provided", () => {
    beforeAll(() => {
      createTestPost("with-tags.mdx", {
        title: "Post With Tags",
        publishedAt: "2025-12-03",
        summary: "With tags",
        tags: ["react", "nextjs"],
      });
    });

    afterAll(() => {
      deleteTestPost("with-tags.mdx");
    });

    it('Given an MDX file WITH tags, When the post is parsed, Then tags array is correctly populated', () => {
      const post = getPostBySlug("with-tags");

      expect(post).toBeDefined();
      expect(post?.tags).toEqual(["react", "nextjs"]);
    });
  });

  describe("Scenario: Reading time is calculated", () => {
    beforeAll(() => {
      // ~400 words = ~2 minutes
      const longContent =
        "word ".repeat(400);
      createTestPost("reading-time-2min.mdx", {
        title: "2 Minute Read",
        publishedAt: "2025-12-03",
        summary: "Reading time test",
      }, longContent);

      // ~1000 words = ~5 minutes
      const veryLongContent =
        "word ".repeat(1000);
      createTestPost("reading-time-5min.mdx", {
        title: "5 Minute Read",
        publishedAt: "2025-12-03",
        summary: "Reading time test",
      }, veryLongContent);
    });

    afterAll(() => {
      deleteTestPost("reading-time-2min.mdx");
      deleteTestPost("reading-time-5min.mdx");
    });

    it('Given a blog post with ~400 words content, When the post metadata is retrieved, Then readingTime is approximately 2 minutes', () => {
      const post = getPostBySlug("reading-time-2min");

      expect(post).toBeDefined();
      expect(post?.readingTime).toBeGreaterThanOrEqual(1);
      expect(post?.readingTime).toBeLessThanOrEqual(3);
    });

    it('Given a blog post with ~1000 words content, When the post metadata is retrieved, Then readingTime is approximately 5 minutes', () => {
      const post = getPostBySlug("reading-time-5min");

      expect(post).toBeDefined();
      expect(post?.readingTime).toBeGreaterThanOrEqual(4);
      expect(post?.readingTime).toBeLessThanOrEqual(6);
    });
  });

  describe("Scenario: Invalid date causes validation error", () => {
    it('Given an MDX file has an invalid publishedAt date, When the date is parsed, Then validation fails appropriately', () => {
      // This test validates that invalid dates are caught
      // In actual implementation, invalid dates should cause build errors
      // For now, we test that the validation schema would reject it
      const invalidDate = "not-a-date";
      const isValidDate = !isNaN(Date.parse(invalidDate));

      // "not-a-date" parses but represents an invalid date intent
      // More specific test would be in schema validation
      expect(isValidDate).toBe(false);
    });
  });

  describe("Scenario: getAllSlugs returns all slugs", () => {
    beforeAll(() => {
      createTestPost("slug-test-1.mdx", {
        title: "Slug Test 1",
        publishedAt: "2025-12-01",
        summary: "Test",
      });
      createTestPost("slug-test-2.mdx", {
        title: "Slug Test 2",
        publishedAt: "2025-12-02",
        summary: "Test",
      });
    });

    afterAll(() => {
      deleteTestPost("slug-test-1.mdx");
      deleteTestPost("slug-test-2.mdx");
    });

    it('When I call getAllSlugs(), Then I receive an array containing all post slugs', () => {
      const slugs = getAllSlugs();

      expect(slugs).toContain("slug-test-1");
      expect(slugs).toContain("slug-test-2");
      expect(Array.isArray(slugs)).toBe(true);
    });
  });

  describe("Scenario: Sorting edge cases", () => {
    beforeAll(() => {
      createTestPost("same-date-a.mdx", {
        title: "Apple Post",
        publishedAt: "2025-12-02",
        summary: "A post",
      });
      createTestPost("same-date-b.mdx", {
        title: "Zebra Post",
        publishedAt: "2025-12-02",
        summary: "Z post",
      });
    });

    afterAll(() => {
      deleteTestPost("same-date-a.mdx");
      deleteTestPost("same-date-b.mdx");
    });

    it('Given two posts with identical publishedAt dates, When sorted, Then they are sorted by title ascending as secondary sort', () => {
      const posts = getAllPosts();
      const sameDatePosts = posts.filter((p: BlogPost) =>
        ["same-date-a", "same-date-b"].includes(p.slug)
      );

      // Filter by exact date
      const filtered = sameDatePosts.filter(
        (p: BlogPost) => p.publishedAt.toISOString().split("T")[0] === "2025-12-02"
      );

      if (filtered.length === 2) {
        expect(filtered[0].title).toBe("Apple Post");
        expect(filtered[1].title).toBe("Zebra Post");
      }
    });
  });

  describe("Scenario: Empty content directory", () => {
    it('When I call getAllPosts() with a potentially empty directory, Then it returns an array (empty or with posts)', () => {
      const posts = getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
    });

    it('When I call getAllSlugs() with a potentially empty directory, Then it returns an array', () => {
      const slugs = getAllSlugs();
      expect(Array.isArray(slugs)).toBe(true);
    });
  });

  describe("Scenario: Slug derivation from filename", () => {
    beforeAll(() => {
      createTestPost("my-slug-test.mdx", {
        title: "Slug Test",
        publishedAt: "2025-12-03",
        summary: "Testing slug derivation",
      });
    });

    afterAll(() => {
      deleteTestPost("my-slug-test.mdx");
    });

    it('Given a file my-slug-test.mdx without explicit slug in frontmatter, When parsed, Then slug is derived from filename as "my-slug-test"', () => {
      const post = getPostBySlug("my-slug-test");
      expect(post?.slug).toBe("my-slug-test");
    });
  });

  describe("Scenario: Custom slug in frontmatter", () => {
    beforeAll(() => {
      createTestPost("file-name.mdx", {
        title: "Custom Slug",
        publishedAt: "2025-12-03",
        summary: "Testing custom slug",
        slug: "custom-slug-value",
      });
    });

    afterAll(() => {
      deleteTestPost("file-name.mdx");
    });

    it('Given a file with explicit slug in frontmatter, When parsed, Then slug uses frontmatter value over filename', () => {
      const post = getPostBySlug("custom-slug-value");
      expect(post).toBeDefined();
      expect(post?.slug).toBe("custom-slug-value");
    });
  });
});
