import type { Metadata } from "next";

import BlogPostPage from "@/app/_localized/BlogPostPage";
import { getBlogPostMetadata } from "@/app/_localized/metadata";
import { getAllPosts } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts("en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getBlogPostMetadata("en", slug);
}

export default async function EnglishBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPage locale="en" slug={slug} />;
}
