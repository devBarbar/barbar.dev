# barbar.dev Portfolio

| Metadata | Details |
| :--- | :--- |
| **Status** | Engineering Ready |
| **Owner** | barbar.dev (Solo) |
| **Target Launch** | November 30, 2025 |

## 1. The Problem (Why?)

**The User Pain Point:**
As a developer, I need a compelling online presence that showcases my skills, projects, and personality to stand out in a competitive job market. Generic resumes and LinkedIn profiles don't convey the depth of my technical abilities or my passion for crafting exceptional user experiences.

**The Business Value:**
An award-winning portfolio will attract potential employers, establish credibility in the dev/design community, and serve as a living demonstration of my frontend and full-stack capabilities. It positions me as a developer who doesn't just write code—but creates memorable digital experiences.

**Hypothesis:**
If I build a visually stunning, interactive portfolio with bold animations, 3D effects, and a clear showcase of my best work, then I will receive more inbound opportunities from employers and increase my visibility in the developer community.

## 2. Proposed Solution (What?)

Build an immersive, award-caliber portfolio website using **Next.js** with the following key features:

- **Hero Section**: Bold 3D WebGL background using React Three Fiber **[FR-01]**
- **Projects Showcase**: 3 featured hero projects (React, React Native, Microfrontends) **[FR-02]**
- **CV/About Section**: Professional background and skills **[FR-03]**
- **Blog**: MDX-powered articles (career journey + technical posts) **[FR-04]**
- **Contact Form**: Simple name/email/message form **[FR-05]**
- **Dark/Light Mode**: Toggle for user preference **[FR-06]**
- **Custom Cursor**: Interactive cursor animations **[FR-07]**
- **Smooth Scroll**: Framer Motion-powered transitions **[FR-08]**

### User Experience

- First impression: immersive 3D hero with bold typography **[FR-09]**
- Smooth scrolling between sections with animation triggers **[FR-10]**
- Interactive cursor that reacts to hoverable elements **[FR-11]**
- Project cards with hover effects and detailed case study views **[FR-12]**
- Clean, readable blog layout for long-form content **[FR-13]**
- Accessible light/dark mode toggle **[FR-14]**

### Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js (App Router) |
| 3D/WebGL | React Three Fiber |
| Animations | Framer Motion |
| Blog Content | MDX |
| Styling | Tailwind CSS |
| Deployment | Vercel (assumed) |

## 3. Success Metrics

| Metric Type | Metric Name | Target |
| :--- | :--- | :--- |
| **North Star** | Employer/Recruiter Contacts | 5+ inbound inquiries within 30 days |
| **Secondary** | Awwwards Recognition | Nomination or Honorable Mention |
| **Secondary** | Portfolio Visitors | 500+ unique visitors in first month |
| **Guardrail** | Page Load Performance | Lighthouse score > 80 **[NFR-01]** |

## 4. Scope

### ✅ In Scope (Must Haves)

* Hero section with 3D WebGL effect (React Three Fiber) **[FR-15]**
* Projects section featuring 3 hero projects (React, React Native, Microfrontends) **[FR-16]**
* CV/About section with professional background **[FR-17]**
* Blog setup with MDX infrastructure **[FR-18]**
* Simple contact form (name, email, message) **[FR-19]**
* Light/Dark mode toggle **[FR-20]**
* Smooth scroll animations (Framer Motion) **[FR-21]**
* Custom cursor animation **[FR-22]**
* Responsive design (mobile + desktop) **[NFR-02]**

### ⏳ Nice to Have

* Multiple blog posts with full content
* Advanced 3D interactions on project cards
* Awwwards-level micro-interactions on all elements
* Page transition animations

### ❌ Out of Scope

* Headless CMS integration
* Newsletter signup functionality
* Analytics dashboard
* Advanced SEO optimization
* Backend API for contact form (can use Formspree/Netlify Forms)
* Multi-language support

## 5. Technical Implementation (High Level)

* **Next.js App Router**: File-based routing with `/`, `/projects`, `/blog`, `/contact`
* **React Three Fiber**: 3D canvas component for hero background (floating geometry or particle field)
* **Framer Motion**: Scroll-triggered animations, page transitions, hover effects
* **MDX**: Blog posts stored in `/content/blog/` with frontmatter metadata
* **Tailwind CSS**: Utility-first styling with dark mode variant support
* **Custom Cursor**: React component tracking mouse position with Framer Motion interpolation
* **Theme Toggle**: Next-themes or custom context for light/dark mode persistence

### Technical Constraints & Acceptance Criteria

#### Contact Form
- **Backend**: Formspree integration (no custom API) **[FR-23]**
- **Validation**: Zod schema with: **[FR-24]**
  - `name`: Required, non-empty string **[FR-25]**
  - `email`: Required, valid email format **[FR-26]**
  - `message`: Required, max 500 characters (show character count) **[FR-27]**
- **Success State**: Display success toast via Sonner **[FR-28]**
- **Error State**: Display error toast via Sonner + render fallback `mailto:contact@barbar.dev` button **[FR-29]**
- **AC**: Form submission errors must show toast within 300ms of response **[NFR-03]**; mailto fallback button appears inline below form **[FR-30]**

#### Performance & 3D
- **Lighthouse Target**: >80 on Performance, Accessibility, Best Practices, SEO (desktop AND mobile) **[NFR-04]**
- **Adaptive Particle Count**: Detect FPS drops below 30fps using `requestAnimationFrame` timing; reduce particle count by 50% dynamically **[NFR-05]**
- **AC**: 3D canvas must not cause main thread blocking >50ms on mobile devices **[NFR-06]**
- **AC**: If WebGL unavailable, gracefully hide 3D canvas (no error, no blank space) **[FR-31]**

#### Custom Cursor
- **Desktop**: Custom animated cursor tracking mouse position with Framer Motion interpolation **[FR-32]**
- **Touch Devices**: Gracefully degrade to native touch; custom cursor component must not render or load on touch devices **[FR-33]**
- **AC**: Use `pointer: coarse` media query or touch detection to conditionally render **[FR-34]**

#### Theme (Dark/Light Mode)
- **Persistence**: localStorage via `next-themes` **[FR-35]**
- **Priority**: localStorage value > system preference (`prefers-color-scheme`) **[FR-36]**
- **Initial Load**: Block render until theme resolved (use `next-themes` `attribute="class"` with `enableSystem={false}` or blocking script) **[NFR-07]**
- **Transition**: 1-second CSS transition on theme toggle for background and accent colors (3D particle colors included) **[NFR-08]**
- **AC**: No flash of wrong theme on initial page load (test with hard refresh + cleared cache) **[NFR-09]**

#### Blog (MDX)
- **Content Location**: `/content/blog/` directory **[FR-37]**
- **Frontmatter Schema**: **[FR-38]**
  - `title`: string (required) **[FR-39]**
  - `publishedAt`: string (required, ISO date format YYYY-MM-DD) **[FR-40]**
  - `summary`: string (required) **[FR-41]**
  - `tags`: string[] (optional) **[FR-42]**
- **Date Display**: Show `publishedAt` from frontmatter on blog post pages and listing **[FR-43]**
- **Initial Content**: Ship with 1 real blog post ("Meet Barbar Ahmad: A Journey in Software Engineering") **[FR-44]**
- **AC**: Blog listing sorted by `publishedAt` descending **[FR-45]**

#### Responsive Design
- **Breakpoints**: Mobile-first; support 320px minimum viewport width **[NFR-10]**
- **Custom Cursor**: Hidden on touch devices **[FR-46]**
- **3D Hero**: Reduced particle count on mobile/low-powered devices **[NFR-11]**
- **AC**: All interactive elements have minimum 44x44px touch target on mobile **[NFR-12]**

#### Dependencies

| Package | Purpose |
| :--- | :--- |
| `zod` | Form validation |
| `sonner` | Toast notifications |
| `next-themes` | Theme persistence |
| `@react-three/fiber` | 3D WebGL |
| `@react-three/drei` | R3F helpers |
| `framer-motion` | Animations |
| `@next/mdx` or `contentlayer` | MDX processing |

## 6. Risks & Dependencies

| Risk | Mitigation |
| :--- | :--- |
| Tight timeline (1 day) | Focus on must-haves only; polish later |
| React Three Fiber learning curve | Use simple geometries; leverage existing examples |
| Performance with 3D + animations | Lazy load 3D canvas; optimize bundle size |
| Blog content not ready | Ship with 1 placeholder post; add more later |
| Contact form backend | Use Formspree or similar no-code solution |

## 7. Resolved Questions

### 3D Hero Effect Decision
**Floating Geometric Particles** – An abstract particle field with floating icosahedrons and torus knots that react to mouse movement **[FR-47]**. Bold, modern, and performant. Particles slowly drift and rotate, with subtle bloom/glow effects **[FR-48]**. Colors shift between accent colors on theme toggle **[FR-49]**.

### Featured Projects

| Project | Type | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Smart Note** | React Native (Expo) | React Native, Expo, Appwrite, OpenAI, TanStack Query | Voice capture & AI insights app—record voice notes, get transcriptions, action items, and daily summaries with AI-powered processing |
| **Study Smarter** | React Web App | TanStack Start, Supabase, OpenAI GPT-4o, TypeScript | AI-powered study companion—upload materials, generate study plans, and engage with a conversational AI tutor with persistent memory |
| **AI Video Generator** | Full-Stack Web | TanStack Start, .NET 9 API, MongoDB, OpenAI | AI-assisted video creation platform—multi-step wizard for ideation, script generation, and YouTube video drafting with channel management |

### Contact Form
**Email**: contact@barbar.dev

### CV / About Content

**Name**: Barbar Ahmad  
**Title**: Lead Software Engineer | React | React Native | .NET  
**Location**: Germany  
**LinkedIn**: https://www.linkedin.com/in/barbar-ahmad

**Bio**:
Lead Software Engineer with over seven years of experience delivering scalable, high-impact systems at global scale. Currently driving engineering initiatives at StoneX Group Inc., specializing in .NET, React, MongoDB, and Azure. Data-driven by default—develop internal tools to monitor SDLC metrics and guide team performance with insight. Strong advocate of outcomes over output, with a focus on test automation (Cypress.io, Jest), CI/CD optimization, and code quality via SonarQube. Not just a manager but a hands-on leader—actively contributes to feature development and technical decision-making. Committed to clean architecture, developer enablement, and building software that works in the real world.

**Key Achievements**:
- 🏆 Reduced Bug Rates by 40% through automated regression testing and continuous delivery practices
- 🏆 Built internal engineering dashboards to track SDLC metrics for data-driven retrospectives
- 🏆 Delivered high-throughput batch payment processing system with .NET 8, MongoDB, and Azure Service Bus
- 🏆 Successfully took over a failed Angular project, reaching full feature parity in 3 sprints
- 🏆 Defined React development standards & micro frontend architecture adopted company-wide at StoneX

**Experience**:
| Role | Company | Period |
| :--- | :--- | :--- |
| Lead Software Engineer - Global Payments | StoneX Group Inc. | 03/2022 - Present |
| Software Developer | StoneX Group Inc. | 12/2020 - 04/2022 |
| Fullstack Developer | StoneX Group Inc. | 09/2018 - 12/2020 |
| Corporate Student | IBM Germany | 10/2014 - 03/2015 |

**Education**:
| Degree | Institution | Period |
| :--- | :--- | :--- |
| B.Sc. Informatik (in progress) | Frankfurt University of Applied Sciences | 2025 - Present |
| B.Sc. Informatik | Frankfurt University of Applied Sciences | 2017 - 2020 |

**Skills**:
React, React Native, Next.js, TypeScript, JavaScript, C#, .NET Framework, Python, SQL, MySQL, MongoDB, Docker, Kubernetes, Azure DevOps, CI/CD, Cypress.io, Jest, SonarQube, NX, Micro Frontends

### Domain Status
✅ **barbar.dev** – Already registered and configured

### Remaining Items
* Project screenshots/thumbnails (can be added post-launch)

### First Blog Post Content

**Title**: Meet Barbar Ahmad: A Journey in Software Engineering and Self-Improvement  
**Published**: 2025-11-30

**Content Summary**:
Introduction to Barbar Ahmad as a Software Engineer with 7 years of experience in financial technology. Covers background from HTML/CSS/JavaScript to React/Next.js/.NET specialization. Explains motivation for starting blog and YouTube channel: documenting the journey, sharing knowledge, and networking. Outlines expected content including technical deep dives, best practices, tutorials, vlogs, how-to videos, and interviews.

---

## 📋 Requirements Traceability Matrix

| ID | Type | Description | Status |
| :--- | :--- | :--- | :--- |
| **[FR-01]** | Functional | Hero Section with 3D WebGL background (React Three Fiber) | Pending |
| **[FR-02]** | Functional | Projects Showcase: 3 featured hero projects | Pending |
| **[FR-03]** | Functional | CV/About Section with professional background | Pending |
| **[FR-04]** | Functional | Blog with MDX-powered articles | Pending |
| **[FR-05]** | Functional | Contact Form: name/email/message | Pending |
| **[FR-06]** | Functional | Dark/Light Mode toggle | Pending |
| **[FR-07]** | Functional | Custom Cursor interactive animations | Pending |
| **[FR-08]** | Functional | Smooth Scroll with Framer Motion transitions | Pending |
| **[FR-09]** | Functional | Immersive 3D hero with bold typography | Pending |
| **[FR-10]** | Functional | Smooth scrolling between sections with animation triggers | Pending |
| **[FR-11]** | Functional | Interactive cursor reacts to hoverable elements | Pending |
| **[FR-12]** | Functional | Project cards with hover effects and case study views | Pending |
| **[FR-13]** | Functional | Clean, readable blog layout for long-form content | Pending |
| **[FR-14]** | Functional | Accessible light/dark mode toggle | Pending |
| **[FR-15]** | Functional | Hero section with 3D WebGL effect (In Scope) | Pending |
| **[FR-16]** | Functional | Projects section featuring 3 hero projects (In Scope) | Pending |
| **[FR-17]** | Functional | CV/About section with professional background (In Scope) | Pending |
| **[FR-18]** | Functional | Blog setup with MDX infrastructure (In Scope) | Pending |
| **[FR-19]** | Functional | Simple contact form (In Scope) | Pending |
| **[FR-20]** | Functional | Light/Dark mode toggle (In Scope) | Pending |
| **[FR-21]** | Functional | Smooth scroll animations with Framer Motion (In Scope) | Pending |
| **[FR-22]** | Functional | Custom cursor animation (In Scope) | Pending |
| **[FR-23]** | Functional | Formspree integration for contact form backend | Pending |
| **[FR-24]** | Functional | Zod schema validation for contact form | Pending |
| **[FR-25]** | Functional | Name field: required, non-empty string | Pending |
| **[FR-26]** | Functional | Email field: required, valid email format | Pending |
| **[FR-27]** | Functional | Message field: required, max 500 chars with counter | Pending |
| **[FR-28]** | Functional | Display success toast via Sonner | Pending |
| **[FR-29]** | Functional | Display error toast + mailto fallback button | Pending |
| **[FR-30]** | Functional | Mailto fallback button appears inline below form | Pending |
| **[FR-31]** | Functional | Gracefully hide 3D canvas if WebGL unavailable | Pending |
| **[FR-32]** | Functional | Desktop: custom animated cursor with Framer Motion | Pending |
| **[FR-33]** | Functional | Touch devices: degrade to native touch (no cursor) | Pending |
| **[FR-34]** | Functional | Use pointer:coarse media query for touch detection | Pending |
| **[FR-35]** | Functional | Theme persistence via localStorage (next-themes) | Pending |
| **[FR-36]** | Functional | localStorage value > system preference priority | Pending |
| **[FR-37]** | Functional | Blog content in `/content/blog/` directory | Pending |
| **[FR-38]** | Functional | Frontmatter schema for blog posts | Pending |
| **[FR-39]** | Functional | Frontmatter: title (required string) | Pending |
| **[FR-40]** | Functional | Frontmatter: publishedAt (required ISO date) | Pending |
| **[FR-41]** | Functional | Frontmatter: summary (required string) | Pending |
| **[FR-42]** | Functional | Frontmatter: tags (optional string array) | Pending |
| **[FR-43]** | Functional | Display publishedAt on blog pages and listing | Pending |
| **[FR-44]** | Functional | Ship with 1 real blog post | Pending |
| **[FR-45]** | Functional | Blog listing sorted by publishedAt descending | Pending |
| **[FR-46]** | Functional | Custom cursor hidden on touch devices | Pending |
| **[FR-47]** | Functional | Particle field with icosahedrons/torus reacting to mouse | Pending |
| **[FR-48]** | Functional | Particles drift/rotate with bloom/glow effects | Pending |
| **[FR-49]** | Functional | Particle colors shift on theme toggle | Pending |
| **[NFR-01]** | Performance | Lighthouse score > 80 (guardrail metric) | Pending |
| **[NFR-02]** | Responsive | Responsive design: mobile + desktop | Pending |
| **[NFR-03]** | Performance | Toast appears within 300ms of form response | Pending |
| **[NFR-04]** | Performance | Lighthouse >80 on all metrics (desktop + mobile) | Pending |
| **[NFR-05]** | Performance | Adaptive particle count: reduce 50% when FPS <30 | Pending |
| **[NFR-06]** | Performance | 3D canvas: no main thread blocking >50ms on mobile | Pending |
| **[NFR-07]** | Performance | Block render until theme resolved (no FOUC) | Pending |
| **[NFR-08]** | UX | 1-second CSS transition on theme toggle | Pending |
| **[NFR-09]** | UX | No flash of wrong theme on initial page load | Pending |
| **[NFR-10]** | Responsive | Mobile-first; 320px minimum viewport width | Pending |
| **[NFR-11]** | Performance | Reduced particle count on mobile/low-powered devices | Pending |
| **[NFR-12]** | Accessibility | Minimum 44x44px touch targets on mobile | Pending |
