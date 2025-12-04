# 🛡️ Master Regression Checklist
> **Status:** Active
> **Last Full Run:** 2025-12-03

## ℹ️ Legend
* `[ ]` = Pending
* `[x]` = Passed

## 🛑 Critical Smoke Tests
- [x] **REG-001 (Blog):** Blog listing page loads at /blog
- [x] **REG-002 (Blog):** Blog post detail page loads at /blog/[slug]
- [x] **REG-003 (404):** Invalid blog slug shows 404 page with CTA

## 📝 Blog Core Features
- [x] **REG-010:** Blog post displays title, date, reading time, tags
- [x] **REG-011:** Share buttons work (Twitter, LinkedIn, Copy)
- [x] **REG-012:** Reading progress bar updates on scroll
- [x] **REG-013:** Back to Blog navigation works
- [x] **REG-014:** Blog listing links to correct posts

## 🎨 Theme System
- [x] **REG-020:** Theme toggle switches between light/dark
- [x] **REG-021:** Theme persists after page refresh
- [x] **REG-022:** No FOUC on page load

## ♿ Accessibility
- [x] **REG-030:** Skip to main content link visible on focus
- [x] **REG-031:** Reading progress bar has proper ARIA attributes
- [x] **REG-032:** Share buttons have proper ARIA labels

## 📱 Responsive
- [x] **REG-040:** Blog post readable on 320px viewport
- [x] **REG-041:** Mobile menu accessible on small screens

## ⚡ Performance
- [x] **REG-050:** LCP < 2.5s on blog post page
- [x] **REG-051:** CLS near 0 on blog post page
