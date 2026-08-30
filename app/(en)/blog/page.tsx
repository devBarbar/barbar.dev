import type { Metadata } from "next";

import BlogIndexPage from "@/app/_localized/BlogIndexPage";
import { getBlogMetadata } from "@/app/_localized/metadata";

export const metadata: Metadata = getBlogMetadata("en");

export default function EnglishBlogIndexPage() {
  return <BlogIndexPage locale="en" />;
}
