# Security Threat Model  Contact Form Feature (015 & 016)

**Date:** 2025-12-04  
**Feature:** Contact Form UI & Submission  
**Methodology:** STRIDE

---

## 1. Data Flow Analysis

```
          ─     
   User Input      Client-Side       Formspree       Barbar's       
  (Name, Email,         Validation             (3rd Party)          Inbox          
   Message)             (Zod Schema)                                               
     ─          ─
                                                      
                                                      
                                                      
   [User Browser]         [Next.js Client]         [HTTPS POST]
```

### Data Points Collected
| Field | Type | Max Length | Validation |
|:------|:-----|:-----------|:-----------|
| `name` | String | 100 chars | Required, non-empty |
| `email` | String | N/A | Required, valid email format |
| `message` | String | 500 grapheme clusters | Required, max 500 chars |

### Trust Boundaries
1. **User  Browser**: Untrusted input
2. **Browser  Formspree**: HTTPS encrypted, but client-side validation only
3. **Formspree  Email**: Third-party controlled

---

## 2. Identified Threats (STRIDE)

### S  Spoofing

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **Email Spoofing** | Attacker submits form with fake email address (e.g., `ceo@company.com`) to impersonate someone | Medium | Formspree does not verify email ownership. **Accept risk**  this is standard for contact forms. Consider adding email verification flow for high-stakes follow-ups. |
| **Bot Submissions** | Automated bots spam the form with fake contacts | High | **Add Formspree's built-in spam protection** (reCAPTCHA or honeypot field). Formspree offers `_gotcha` honeypot field. |

### T  Tampering

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **Client-Side Validation Bypass** | Attacker uses browser DevTools or curl to bypass Zod validation and submit invalid/malicious data | Medium | **Formspree handles server-side validation**. Document states "XSS sanitization: Formspree handles (no client-side needed)". Verify Formspree's sanitization in their docs. |
| **Message Length Bypass** | Attacker bypasses 500-char limit via direct API call | Low | Accept risk  Formspree will accept the message. No security impact, just data quality. |
| **Payload Injection in Name/Message** | Attacker injects `<script>` tags or SQL in fields | Medium | **Formspree sanitizes output** before forwarding to email. Email clients don't execute scripts. Verify Formspree's handling of HTML content. |

### R  Repudiation

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **Sender Denies Message** | Someone claims they didn't send a contact message | Low | **Accept risk**  Contact forms inherently lack sender verification. Formspree provides submission timestamps and IP logging. |
| **No Audit Trail** | No record of form submissions on client side | Low | Formspree provides dashboard with submission history. No additional logging needed for portfolio site. |

### I  Information Disclosure

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **Formspree API Key Exposure** | Formspree form ID exposed in client-side code | Low | **Accept risk**  Formspree form IDs are designed to be public (similar to Mailchimp). They use domain verification to prevent abuse. |
| **Error Message Leakage** | Detailed error messages reveal internal system info | Low | Ensure toast notifications show generic user-friendly messages ("Something went wrong. Please try again.")  no stack traces or Formspree internals. |
| **PII in Browser Storage** | User's submitted data persisted in localStorage | None | **Good**  Spec states "Draft persistence: Not needed (no localStorage)". No PII stored client-side. |
| **Email Exposed in mailto Fallback** | `contact@barbar.dev` visible in fallback button | None | **Accept**  This is intentional public contact email. |

### D  Denial of Service

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **Form Spam Attack** | Attacker floods form with thousands of submissions, exhausting Formspree quota | High | **Implement rate limiting/spam protection**:<br>1. Enable Formspree's built-in reCAPTCHA<br>2. Add honeypot field (`_gotcha`)<br>3. Formspree's free tier has 50 submissions/month  upgrade if needed |
| **Client-Side DoS via Character Count** | Attacker pastes extremely long strings to freeze browser during grapheme cluster counting | Low | Spec states "Paste over limit: Reject (do not truncate)". Ensure `Intl.Segmenter` or grapheme-splitter library handles large strings efficiently. Add early return if input > 1000 chars. |
| **Network Timeout Abuse** | Attacker triggers many concurrent submissions to hit 30s timeout | Low | Spec includes "Submit button: Disable immediately on click (prevent double-submit)". Good mitigation for legitimate users. Formspree handles server-side throttling. |

### E  Elevation of Privilege

| Threat | Description | Severity | Mitigation Strategy |
|:-------|:------------|:---------|:--------------------|
| **No Privilege System** | Contact form has no authentication or authorization | None | N/A  Public form by design. No user accounts or roles. |
| **Formspree Dashboard Access** | If Formspree credentials are compromised, attacker reads all submissions | Medium | **Use strong password + 2FA on Formspree account**. Keep Formspree credentials separate from code repository. |

---

## 3. Attack Surface Summary

| Component | Exposure | Risk Level |
|:----------|:---------|:-----------|
| Client-side form | Public internet | Medium |
| Formspree API endpoint | Public (form ID) | Low |
| Formspree dashboard | Authenticated | Medium |
| Email inbox (contact@barbar.dev) | N/A | N/A |

---

## 4. Recommended Security Controls

### Must Implement (Before Launch)

| Control | Implementation | Owner |
|:--------|:--------------|:------|
| **Honeypot Field** | Add hidden `_gotcha` field to form. Bots fill it, humans don't. Formspree ignores submissions with filled honeypot. | Developer |
| **Generic Error Messages** | Ensure error toasts don't expose Formspree internals or stack traces | Developer |
| **HTTPS Only** | Verify Vercel enforces HTTPS for barbar.dev | DevOps |

### Should Implement (Recommended)

| Control | Implementation | Owner |
|:--------|:--------------|:------|
| **reCAPTCHA v3** | Add invisible reCAPTCHA for stronger bot protection. Formspree supports this natively. | Developer |
| **Formspree 2FA** | Enable 2-factor authentication on Formspree dashboard | Owner |
| **Rate Limit UX** | Show user-friendly message if Formspree returns 429 (rate limited) | Developer |

### Could Implement (Nice to Have)

| Control | Implementation | Owner |
|:--------|:--------------|:------|
| **Client-side Input Sanitization** | Escape HTML entities in name/message before display (if echoed back) | Developer |
| **Submission Confirmation Email** | Configure Formspree to send auto-reply to submitter | Owner |

---

## 5. Formspree-Specific Security Checklist

| Item | Status | Notes |
|:-----|:-------|:------|
| Domain verification enabled |  TODO | Configure allowed domains in Formspree to reject cross-site submissions |
| Spam protection enabled |  TODO | Enable reCAPTCHA or honeypot in Formspree settings |
| Email notifications configured |  TODO | Ensure `contact@barbar.dev` receives submissions |
| Dashboard 2FA |  TODO | Enable on Formspree account |
| Monthly quota monitoring |  TODO | Set up alerts before hitting free tier limit |

---

## 6. Testing Recommendations

### Security Test Cases

```gherkin
Scenario: XSS attempt in message field
  Given I enter "<script>alert('xss')</script>" in the message field
  When I submit the form
  Then the script is not executed in any response
  And the email received shows sanitized text

Scenario: SQL injection attempt
  Given I enter "'; DROP TABLE users; --" in the name field
  When I submit the form
  Then the submission is processed normally
  And no database error occurs (Formspree has no SQL backend)

Scenario: Honeypot prevents bot submission
  Given I fill the hidden _gotcha field
  When I submit the form
  Then Formspree ignores the submission
  And no email is received

Scenario: Cross-site submission blocked
  Given I submit the form from a different domain
  When Formspree receives the request
  Then the submission is rejected (if domain verification enabled)

Scenario: Oversized payload handling
  Given I bypass client validation and submit a 10MB message
  When Formspree receives the request
  Then the request is rejected with appropriate error
  And no service degradation occurs
```

---

## 7. Residual Risks (Accepted)

| Risk | Reason for Acceptance |
|:-----|:---------------------|
| Email spoofing | Industry standard for contact forms; no sensitive actions triggered by form |
| Public form endpoint | Required for functionality; Formspree is designed for this |
| No sender verification | Adding email verification would hurt conversion; low-stakes use case |
| Formspree as single point of failure | Mailto fallback provides degraded functionality |

---

## 8. Sign-Off

| Role | Name | Date | Signature |
|:-----|:-----|:-----|:----------|
| Security Review | [Security Engineer] | 2025-12-04 |  |
| Developer | [Developer] | | |
| Owner | Barbar Ahmad | | |
