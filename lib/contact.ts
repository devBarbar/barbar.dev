import { z } from "zod";

/**
 * Maximum characters allowed for the message field
 * Uses grapheme clusters, not code units
 */
export const MESSAGE_MAX_LENGTH = 500;

/**
 * Maximum characters allowed for the name field
 */
export const NAME_MAX_LENGTH = 100;

/**
 * Character count thresholds for visual feedback
 * Yellow warning at ~80%, red danger at ~96%
 */
export const CHAR_COUNT_THRESHOLDS = {
  warning: Math.floor(MESSAGE_MAX_LENGTH * 0.8), // 400
  danger: Math.floor(MESSAGE_MAX_LENGTH * 0.96), // 480
} as const;

/**
 * Count grapheme clusters in a string (handles emoji and special characters correctly)
 * @param str - The string to count
 * @returns The number of grapheme clusters
 */
export function countGraphemes(str: string): number {
  // Use Intl.Segmenter for accurate grapheme cluster counting
  // Fallback to length if not supported (older browsers)
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...segmenter.segment(str)].length;
  }
  // Fallback: count code points (not perfect but better than length)
  return [...str].length;
}

/**
 * Zod schema for contact form validation
 * Validates name, email, and message fields
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(NAME_MAX_LENGTH, `Name must be ${NAME_MAX_LENGTH} characters or less`),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .refine(
      (val) => countGraphemes(val) <= MESSAGE_MAX_LENGTH,
      `Message must be ${MESSAGE_MAX_LENGTH} characters or less`
    ),
});

/**
 * Type for form values derived from the Zod schema
 */
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Default form values
 */
export const defaultFormValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};
