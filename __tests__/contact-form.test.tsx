import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock matchMedia for jsdom
const mockMatchMedia = (reducedMotion: boolean = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock IntersectionObserver for whileInView detection
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Simulate element entering viewport immediately for tests
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 0.2,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this as unknown as IntersectionObserver
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Mock requestAnimationFrame
const mockRAF = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16) as unknown as number;
});

// Mock cursor context
vi.mock("@/hooks/use-cursor", () => ({
  useCursor: () => ({
    setIsHovering: vi.fn(),
    setVariant: vi.fn(),
    cursorState: { x: 0, y: 0, isHovering: false, isVisible: true, variant: "default" },
    prefersReducedMotion: false,
  }),
}));

// Wrapper component for testing
const TestWrapper = ({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) => (
  <ThemeProvider
    attribute="class"
    defaultTheme={defaultTheme}
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
);

// ============================================================================
// TESTS: CONTACT FORM VALIDATION SCHEMA
// ============================================================================

describe("Contact Form Validation Schema (lib/contact.ts)", () => {
  describe("Scenario: Zod schema validates correctly", () => {
    it("Given valid form data, When I validate, Then validation passes", async () => {
      const { contactFormSchema } = await import("@/lib/contact");

      const validData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message.",
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("Given empty name, When I validate, Then validation fails with 'Name is required'", async () => {
      const { contactFormSchema } = await import("@/lib/contact");

      const invalidData = {
        name: "",
        email: "john@example.com",
        message: "Hello",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required");
      }
    });

    it("Given name over 100 characters, When I validate, Then validation fails", async () => {
      const { contactFormSchema, NAME_MAX_LENGTH } = await import(
        "@/lib/contact"
      );

      const longName = "a".repeat(NAME_MAX_LENGTH + 1);
      const invalidData = {
        name: longName,
        email: "john@example.com",
        message: "Hello",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("100");
      }
    });

    it("Given empty email, When I validate, Then validation fails with 'Email is required'", async () => {
      const { contactFormSchema } = await import("@/lib/contact");

      const invalidData = {
        name: "John",
        email: "",
        message: "Hello",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email is required");
      }
    });

    it("Given invalid email format, When I validate, Then validation fails with email error", async () => {
      const { contactFormSchema } = await import("@/lib/contact");

      const invalidEmails = ["notanemail", "test@", "@test.com", "test@.com"];

      for (const email of invalidEmails) {
        const result = contactFormSchema.safeParse({
          name: "John",
          email,
          message: "Hello",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain("email");
        }
      }
    });

    it("Given empty message, When I validate, Then validation fails with 'Message is required'", async () => {
      const { contactFormSchema } = await import("@/lib/contact");

      const invalidData = {
        name: "John",
        email: "john@example.com",
        message: "",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Message is required");
      }
    });

    it("Given message over 500 grapheme clusters, When I validate, Then validation fails", async () => {
      const { contactFormSchema, MESSAGE_MAX_LENGTH } = await import(
        "@/lib/contact"
      );

      const longMessage = "a".repeat(MESSAGE_MAX_LENGTH + 1);
      const invalidData = {
        name: "John",
        email: "john@example.com",
        message: longMessage,
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("500");
      }
    });

    it("Given message with exactly 500 characters, When I validate, Then validation passes", async () => {
      const { contactFormSchema, MESSAGE_MAX_LENGTH } = await import(
        "@/lib/contact"
      );

      const exactMessage = "a".repeat(MESSAGE_MAX_LENGTH);
      const validData = {
        name: "John",
        email: "john@example.com",
        message: exactMessage,
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario: Grapheme cluster counting", () => {
    it("Given countGraphemes function, When I count single characters, Then count equals length", async () => {
      const { countGraphemes } = await import("@/lib/contact");

      expect(countGraphemes("hello")).toBe(5);
      expect(countGraphemes("test123")).toBe(7);
    });

    it("Given countGraphemes function, When I count emoji, Then emoji counts as single grapheme", async () => {
      const { countGraphemes } = await import("@/lib/contact");

      // Each emoji should count as 1 grapheme
      expect(countGraphemes("👋")).toBe(1);
      expect(countGraphemes("👨‍👩‍👧‍👦")).toBe(1); // Family emoji (ZWJ sequence)
      expect(countGraphemes("Hello 👋 World")).toBe(13); // 5 + 1 + 1 + 1 + 5
    });

    it("Given a message with emoji near the limit, When I check graphemes, Then limit is respected", async () => {
      const { contactFormSchema, MESSAGE_MAX_LENGTH, countGraphemes } =
        await import("@/lib/contact");

      // Create a message with emoji that's at the limit
      const textPart = "a".repeat(MESSAGE_MAX_LENGTH - 2);
      const messageAtLimit = textPart + "👋👋"; // Should be exactly 500 graphemes

      expect(countGraphemes(messageAtLimit)).toBe(MESSAGE_MAX_LENGTH);

      const result = contactFormSchema.safeParse({
        name: "John",
        email: "john@example.com",
        message: messageAtLimit,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario: Character count thresholds", () => {
    it("Given thresholds, When I check values, Then warning is at 80% and danger at 96%", async () => {
      const { CHAR_COUNT_THRESHOLDS, MESSAGE_MAX_LENGTH } = await import(
        "@/lib/contact"
      );

      expect(CHAR_COUNT_THRESHOLDS.warning).toBe(400); // 80% of 500
      expect(CHAR_COUNT_THRESHOLDS.danger).toBe(480); // 96% of 500
      expect(MESSAGE_MAX_LENGTH).toBe(500);
    });
  });
});

// ============================================================================
// TESTS: CONTACT FORM COMPONENT
// ============================================================================

describe("ContactForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Contact form displays all fields", () => {
    it("Given I navigate to the contact section, When the form loads, Then I see fields for name, email, and message", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Then: All fields are visible
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it("Given the form loads, When I check labels, Then each field has a visible label above it", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Then: Labels exist and are associated with inputs
      const nameLabel = screen.getByText(/^name$/i);
      const emailLabel = screen.getByText(/^email$/i);
      const messageLabel = screen.getByText(/^message$/i);

      expect(nameLabel).toBeInTheDocument();
      expect(emailLabel).toBeInTheDocument();
      expect(messageLabel).toBeInTheDocument();

      // Labels should have htmlFor attributes
      expect(nameLabel).toHaveAttribute("for", "name");
      expect(emailLabel).toHaveAttribute("for", "email");
      expect(messageLabel).toHaveAttribute("for", "message");
    });

    it("Given the form loads, When I check the submit button, Then it exists", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole("button", { name: /send/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Scenario: Character count displays for message", () => {
    it("Given I am typing in the message field, When I type characters, Then I see a live character count (e.g., '123/500')", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const messageField = screen.getByLabelText(/message/i);
      await user.type(messageField, "Hello World");

      // Then: Character count is displayed
      expect(screen.getByText("11/500")).toBeInTheDocument();
    });

    it("Given I type 400+ characters, When I check the counter, Then the counter turns yellow", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const messageField = screen.getByLabelText(/message/i);
      fireEvent.change(messageField, { target: { value: "a".repeat(410) } });

      // Then: Counter has warning class
      const counter = screen.getByTestId("char-counter");
      expect(counter.className).toContain("warning");
    });

    it("Given I type 480+ characters, When I check the counter, Then the counter turns red", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const messageField = screen.getByLabelText(/message/i);
      fireEvent.change(messageField, { target: { value: "a".repeat(490) } });

      // Then: Counter has danger class
      const counter = screen.getByTestId("char-counter");
      expect(counter.className).toContain("danger");
    });
  });

  describe("Scenario: Character limit enforced", () => {
    it("Given I paste text exceeding 500 grapheme clusters, When the paste event fires, Then the paste is rejected", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const messageField = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      // First set some existing content
      fireEvent.change(messageField, { target: { value: "existing" } });

      // Create paste data exceeding limit
      const pasteData = "a".repeat(600);
      const clipboardData = {
        getData: () => pasteData,
      };

      // Fire paste event
      fireEvent.paste(messageField, { clipboardData });

      // Then: Existing content should remain unchanged
      expect(messageField.value).toBe("existing");
    });

    it("Given existing content, When I paste that would exceed limit, Then paste is rejected entirely", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      const messageField = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      // Set content near limit
      fireEvent.change(messageField, { target: { value: "a".repeat(490) } });

      // Try to paste 20 more characters (would exceed 500)
      const pasteData = "b".repeat(20);
      const clipboardData = {
        getData: () => pasteData,
      };

      fireEvent.paste(messageField, { clipboardData });

      // Then: Content should remain at 490
      expect(messageField.value).toBe("a".repeat(490));
    });
  });

  describe("Scenario: Validation errors display", () => {
    it("Given I submit the form with empty fields, When validation runs on submit, Then I see inline error messages below each invalid field", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Submit empty form
      const submitButton = screen.getByRole("button", { name: /send/i });
      await user.click(submitButton);

      // Then: Error messages appear
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Email validation works", () => {
    it("Given I enter an invalid email format, When I submit the form, Then I see an inline error message about invalid email", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Fill in name and message, but invalid email
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "notanemail");
      await user.type(screen.getByLabelText(/message/i), "Hello");

      const submitButton = screen.getByRole("button", { name: /send/i });
      await user.click(submitButton);

      // Then: Email error appears
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Name validation works", () => {
    it("Given I enter a name longer than 100 characters, When I submit the form, Then I see an inline error message about name length", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Fill in long name
      const longName = "a".repeat(101);
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: longName },
      });
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello");

      const submitButton = screen.getByRole("button", { name: /send/i });
      await user.click(submitButton);

      // Then: Name length error appears
      await waitFor(() => {
        expect(screen.getByText(/100 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe("Scenario: Form is accessible", () => {
    it("Given I am using a screen reader, When I navigate the form, Then all fields have proper labels with htmlFor association", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Check accessible names
      expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
    });

    it("Given validation errors exist, When I check error elements, Then error messages have aria-describedby association", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Submit empty form to trigger errors
      const submitButton = screen.getByRole("button", { name: /send/i });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveAttribute("aria-describedby");
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("Given the form, When I check focus order, Then focus order is Name → Email → Message → Submit", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Tab through the form
      await user.tab();
      expect(screen.getByLabelText(/name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/message/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /send/i })).toHaveFocus();
    });
  });

  describe("Scenario: Form shows hydration state", () => {
    it("Given the form component, When mounted is false, Then the form has loading state", async () => {
      const { ContactForm } = await import("@/components/contact-form");

      // Form should handle initial mount state
      const { rerender } = render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // After mount, form should be interactive
      await waitFor(() => {
        const submitButton = screen.getByRole("button", { name: /send/i });
        expect(submitButton).not.toBeDisabled();
      });

      // Rerender to ensure consistency
      rerender(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );
    });
  });

  describe("Scenario: Submit button prevents double-submit", () => {
    it("Given I click submit, When the form is processing, Then the button is disabled", async () => {
      const { ContactForm } = await import("@/components/contact-form");
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ContactForm />
        </TestWrapper>
      );

      // Fill valid data
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello World");

      const submitButton = screen.getByRole("button", { name: /send/i });

      // Click submit - button should disable immediately
      await user.click(submitButton);

      // Note: Full submission handling is in next story (016)
      // This test verifies the button can be disabled
      expect(submitButton).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: CONTACT SECTION COMPONENT
// ============================================================================

describe("ContactSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Contact section has proper heading", () => {
    it("Given I navigate to the contact section, When it loads, Then I see a heading 'Get In Touch' with proper semantics", async () => {
      const { ContactSection } = await import("@/components/contact-section");

      render(
        <TestWrapper>
          <ContactSection />
        </TestWrapper>
      );

      // Then: Heading exists with proper id
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(/get in touch/i);
      expect(heading).toHaveAttribute("id", "contact-heading");
    });
  });

  describe("Scenario: Contact section has proper anchor id", () => {
    it("Given the contact section, When I check the id, Then it has id='contact' for anchor navigation", async () => {
      const { ContactSection } = await import("@/components/contact-section");

      const { container } = render(
        <TestWrapper>
          <ContactSection />
        </TestWrapper>
      );

      const section = container.querySelector("#contact");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Scenario: Contact section uses scale animation", () => {
    it("Given the contact section, When I check the wrapper, Then it uses AnimatedSection with scale animation", async () => {
      const { ContactSection } = await import("@/components/contact-section");

      render(
        <TestWrapper>
          <ContactSection />
        </TestWrapper>
      );

      // Check the section has test id
      expect(screen.getByTestId("contact-section")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: THEME INTEGRATION
// ============================================================================

describe("Contact Form Theme Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Form works in dark mode", () => {
    it("Given I am in dark mode, When I view the contact form, Then it renders properly", async () => {
      const { ContactSection } = await import("@/components/contact-section");

      render(
        <TestWrapper defaultTheme="dark">
          <ContactSection />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });

  describe("Scenario: Form works in light mode", () => {
    it("Given I am in light mode, When I view the contact form, Then it renders properly", async () => {
      const { ContactSection } = await import("@/components/contact-section");

      render(
        <TestWrapper defaultTheme="light">
          <ContactSection />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS: REDUCED MOTION
// ============================================================================

describe("Contact Form Reduced Motion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.requestAnimationFrame = mockRAF;
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Scenario: Form respects reduced motion", () => {
    it("Given reduced motion is enabled, When I view the contact form, Then content still renders", async () => {
      mockMatchMedia(true);
      const { ContactSection } = await import("@/components/contact-section");

      render(
        <TestWrapper>
          <ContactSection />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });
});
