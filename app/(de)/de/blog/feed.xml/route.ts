import { createBlogFeed } from "@/app/_localized/blogFeed";

export const dynamic = "force-static";

export function GET() {
  return createBlogFeed("de");
}
