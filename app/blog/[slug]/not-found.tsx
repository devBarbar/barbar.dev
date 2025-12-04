import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Blog-specific 404 Not Found Page
 *
 * Displayed when a blog post slug doesn't exist.
 * Per spec: Shows "Post Not Found" with CTA to browse all posts.
 */
export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 mb-8 rounded-full bg-muted flex items-center justify-center">
            <FileText
              className="w-12 h-12 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Post Not Found
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          {/* CTA Button */}
          <Button asChild size="lg">
            <Link href="/blog">
              <span>← Browse all posts</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
