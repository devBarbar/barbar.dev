"use client";

import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";

/**
 * ContactSection - Contact form section for the portfolio site.
 *
 * Features:
 * - Appears at the bottom of every page (via layout)
 * - Uses scale animation per spec
 * - Has id="contact" for anchor navigation
 * - Proper heading with id for aria-labelledby
 */
export function ContactSection() {
  return (
    <AnimatedSection
      animation="scale"
      as="section"
      data-testid="contact-section"
      className="py-16 md:py-24"
    >
      <div id="contact" className="container mx-auto px-4 max-w-2xl">
        <h2
          id="contact-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-8"
        >
          Get In Touch
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Have a project in mind or want to discuss opportunities? I&apos;d love
          to hear from you.
        </p>
        <ContactForm />
      </div>
    </AnimatedSection>
  );
}
