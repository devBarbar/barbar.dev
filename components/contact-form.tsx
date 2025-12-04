"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CursorTarget } from "@/components/cursor-target";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  countGraphemes,
  MESSAGE_MAX_LENGTH,
  CHAR_COUNT_THRESHOLDS,
  type ContactFormValues,
  defaultFormValues,
} from "@/lib/contact";

/**
 * ContactForm - Contact form with Zod validation.
 *
 * Features:
 * - Name, Email, Message fields with validation on submit
 * - Live character counter for message field with color feedback
 * - Paste rejection when exceeding grapheme limit
 * - Accessible with proper labels and aria attributes
 * - Hydration state handling
 * - Submit button disables on click to prevent double-submit
 */
export function ContactForm() {
  const formId = useId();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] =
    useState<ContactFormValues>(defaultFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [charCount, setCharCount] = useState(0);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update character count when message changes
  useEffect(() => {
    setCharCount(countGraphemes(formValues.message));
  }, [formValues.message]);

  /**
   * Handle input change for text fields
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof ContactFormValues]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Handle paste event for message field - reject if would exceed limit
   */
  const handleMessagePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pasteData = e.clipboardData.getData("text");
      const currentValue = formValues.message;

      // Get selection to calculate final length
      const target = e.target as HTMLTextAreaElement;
      const selectionStart = target.selectionStart || 0;
      const selectionEnd = target.selectionEnd || 0;

      // Calculate what the new value would be after paste
      const beforeSelection = currentValue.slice(0, selectionStart);
      const afterSelection = currentValue.slice(selectionEnd);
      const newValue = beforeSelection + pasteData + afterSelection;

      const newGraphemeCount = countGraphemes(newValue);

      if (newGraphemeCount > MESSAGE_MAX_LENGTH) {
        // Reject the paste entirely
        e.preventDefault();
      }
    },
    [formValues.message]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Disable button immediately
      setIsSubmitting(true);

      // Validate with Zod
      const result = contactFormSchema.safeParse(formValues);

      if (!result.success) {
        // Map Zod errors to our error state
        const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ContactFormValues;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Form is valid - actual submission handled in story 016
      // For now, just log and reset
      console.log("Form submitted:", result.data);

      // Reset form after brief delay (simulating submission)
      setTimeout(() => {
        setFormValues(defaultFormValues);
        setIsSubmitting(false);
      }, 500);
    },
    [formValues]
  );

  /**
   * Get character counter color class based on count
   */
  const getCounterClass = useCallback(() => {
    if (charCount >= CHAR_COUNT_THRESHOLDS.danger) {
      return "danger";
    }
    if (charCount >= CHAR_COUNT_THRESHOLDS.warning) {
      return "warning";
    }
    return "";
  }, [charCount]);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <form className="space-y-6" aria-busy="true">
        <div className="space-y-2">
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
          <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
          <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" id={`${formId}-name-label`}>
          Name
        </Label>
        <CursorTarget variant="text">
          <Input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            aria-invalid={!!errors.name}
            className={cn(
              "min-h-[44px]",
              errors.name && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isSubmitting}
          />
        </CursorTarget>
        {errors.name && (
          <p
            id={`${formId}-name-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" id={`${formId}-email-label`}>
          Email
        </Label>
        <CursorTarget variant="text">
          <Input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            aria-invalid={!!errors.email}
            className={cn(
              "min-h-[44px]",
              errors.email && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isSubmitting}
          />
        </CursorTarget>
        {errors.email && (
          <p
            id={`${formId}-email-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="message" id={`${formId}-message-label`}>
            Message
          </Label>
          <span
            data-testid="char-counter"
            className={cn(
              "text-sm text-muted-foreground transition-colors char-counter",
              getCounterClass()
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <CursorTarget variant="text">
          <Textarea
            id="message"
            name="message"
            value={formValues.message}
            onChange={handleChange}
            onPaste={handleMessagePaste}
            aria-describedby={
              errors.message ? `${formId}-message-error` : undefined
            }
            aria-invalid={!!errors.message}
            className={cn(
              "min-h-[120px] resize-y",
              errors.message && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isSubmitting}
          />
        </CursorTarget>
        {errors.message && (
          <p
            id={`${formId}-message-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <CursorTarget>
        <Button
          type="submit"
          className="w-full min-h-[44px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </CursorTarget>
    </form>
  );
}
