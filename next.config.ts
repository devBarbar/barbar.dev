import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

// Wrap the Next.js config with MDX support
// Note: rehype-pretty-code, remark-gfm, and remark-frontmatter are configured as string references
// for Turbopack compatibility. Theme configuration uses data-theme attribute
// in CSS for light/dark mode switching.
// remark-frontmatter strips YAML frontmatter from rendered content (prevents it from rendering as H2)
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: ["rehype-pretty-code"],
  },
});

export default withMDX(nextConfig);
