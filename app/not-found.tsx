import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Global 404 Not Found Page
 *
 * Displayed when a route doesn't match any page in the app.
 * Provides navigation back to home.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 mb-8 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion
              className="w-12 h-12 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* CTA Button */}
          <Button asChild size="lg">
            <Link href="/">
              <span>← Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
