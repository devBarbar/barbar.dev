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

- **Hero Section**: Bold 3D WebGL background using React Three Fiber
- **Projects Showcase**: 3 featured hero projects (React, React Native, Microfrontends)
- **CV/About Section**: Professional background and skills
- **Blog**: MDX-powered articles (career journey + technical posts)
- **Contact Form**: Simple name/email/message form
- **Dark/Light Mode**: Toggle for user preference
- **Custom Cursor**: Interactive cursor animations
- **Smooth Scroll**: Framer Motion-powered transitions

### User Experience

- First impression: immersive 3D hero with bold typography
- Smooth scrolling between sections with animation triggers
- Interactive cursor that reacts to hoverable elements
- Project cards with hover effects and detailed case study views
- Clean, readable blog layout for long-form content
- Accessible light/dark mode toggle

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
| **Guardrail** | Page Load Performance | Lighthouse score > 80 |

## 4. Scope

### ✅ In Scope (Must Haves)

* Hero section with 3D WebGL effect (React Three Fiber)
* Projects section featuring 3 hero projects (React, React Native, Microfrontends)
* CV/About section with professional background
* Blog setup with MDX infrastructure
* Simple contact form (name, email, message)
* Light/Dark mode toggle
* Smooth scroll animations (Framer Motion)
* Custom cursor animation
* Responsive design (mobile + desktop)

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
- **Backend**: Formspree integration (no custom API)
- **Validation**: Zod schema with:
  - `name`: Required, non-empty string
  - `email`: Required, valid email format
  - `message`: Required, max 500 characters (show character count)
- **Success State**: Display success toast via Sonner
- **Error State**: Display error toast via Sonner + render fallback `mailto:contact@barbar.dev` button
- **AC**: Form submission errors must show toast within 300ms of response; mailto fallback button appears inline below form

#### Performance & 3D
- **Lighthouse Target**: >80 on Performance, Accessibility, Best Practices, SEO (desktop AND mobile)
- **Adaptive Particle Count**: Detect FPS drops below 30fps using `requestAnimationFrame` timing; reduce particle count by 50% dynamically
- **AC**: 3D canvas must not cause main thread blocking >50ms on mobile devices
- **AC**: If WebGL unavailable, gracefully hide 3D canvas (no error, no blank space)

#### Custom Cursor
- **Desktop**: Custom animated cursor tracking mouse position with Framer Motion interpolation
- **Touch Devices**: Gracefully degrade to native touch; custom cursor component must not render or load on touch devices
- **AC**: Use `pointer: coarse` media query or touch detection to conditionally render

#### Theme (Dark/Light Mode)
- **Persistence**: localStorage via `next-themes`
- **Priority**: localStorage value > system preference (`prefers-color-scheme`)
- **Initial Load**: Block render until theme resolved (use `next-themes` `attribute="class"` with `enableSystem={false}` or blocking script)
- **Transition**: 1-second CSS transition on theme toggle for background and accent colors (3D particle colors included)
- **AC**: No flash of wrong theme on initial page load (test with hard refresh + cleared cache)

#### Blog (MDX)
- **Content Location**: `/content/blog/` directory
- **Frontmatter Schema**:
  - `title`: string (required)
  - `publishedAt`: string (required, ISO date format YYYY-MM-DD)
  - `summary`: string (required)
  - `tags`: string[] (optional)
- **Date Display**: Show `publishedAt` from frontmatter on blog post pages and listing
- **Initial Content**: Ship with 1 real blog post ("Meet Barbar Ahmad: A Journey in Software Engineering")
- **AC**: Blog listing sorted by `publishedAt` descending

#### Responsive Design
- **Breakpoints**: Mobile-first; support 320px minimum viewport width
- **Custom Cursor**: Hidden on touch devices
- **3D Hero**: Reduced particle count on mobile/low-powered devices
- **AC**: All interactive elements have minimum 44x44px touch target on mobile

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
**Floating Geometric Particles** – An abstract particle field with floating icosahedrons and torus knots that react to mouse movement. Bold, modern, and performant. Particles slowly drift and rotate, with subtle bloom/glow effects. Colors shift between accent colors on theme toggle.

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
