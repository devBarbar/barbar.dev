import type { Locale } from "@/lib/locales";

const sharedProjects = {
  "smart-note": {
    slug: "smart-note",
    name: "Smart Note",
    techStack: ["React Native", "Expo", "Appwrite", "OpenAI", "TanStack Query"],
    githubUrl: "#",
    liveUrl: "#",
  },
  "study-smarter": {
    slug: "study-smarter",
    name: "Study Smarter",
    techStack: ["TanStack Start", "Supabase", "OpenAI GPT-4o", "TypeScript"],
    githubUrl: "#",
    liveUrl: "#",
  },
  "ai-video-generator": {
    slug: "ai-video-generator",
    name: "AI Video Generator",
    techStack: ["TanStack Start", ".NET 9 API", "MongoDB", "OpenAI"],
    githubUrl: "#",
    liveUrl: "#",
  },
} as const;

const portfolioData = {
  en: {
    personalInfo: {
      name: "Barbar Ahmad",
      title: "Lead Software Engineer",
      location: "Frankfurt, Germany",
      linkedInUrl: "https://www.linkedin.com/in/barbar-ahmad",
      bio: "Passionate software engineer with 7+ years of experience building scalable web and mobile applications. Currently leading UI/UX and frontend development at Marex, specializing in React, TypeScript, and modern architectures. I thrive on solving complex problems and mentoring teams to deliver high-quality software.",
    },
    achievements: [
      "Reduced production bugs by 40% through implementation of testing strategies",
      "Built SDLC dashboards improving team visibility and delivery metrics",
      "Architected a batch payment system processing millions in daily transactions",
      "Led an Angular-to-React migration for a critical legacy application",
      "Established React coding standards adopted across multiple teams",
    ],
    experience: [
      {
        role: "Lead Software Engineer",
        company: "Marex",
        period: "Dec 2025 – Present",
        description: "Leading UI/UX and frontend development for the new Neon Payments product.",
      },
      {
        role: "Lead Software Engineer",
        company: "StoneX Group",
        period: "Jan 2023 – Nov 2025",
        description: "Led frontend development for trading platforms using React, TypeScript, and micro-frontend architecture. Mentored junior developers and drove technical decisions for a team of eight engineers.",
      },
      {
        role: "Software Developer",
        company: "StoneX Group",
        period: "Mar 2021 – Dec 2022",
        description: "Developed and maintained trading applications using React, .NET, and Azure. Implemented CI/CD pipelines and improved code quality through SonarQube integration.",
      },
      {
        role: "Full-stack Developer",
        company: "StoneX Group",
        period: "Sep 2020 – Feb 2021",
        description: "Built full-stack features using C#, .NET Framework, and React. Collaborated with cross-functional teams to deliver customer-facing trading tools.",
      },
      {
        role: "Corporate Student",
        company: "IBM",
        period: "Oct 2017 – Aug 2020",
        description: "Worked on enterprise software solutions while completing my studies, gaining experience with Python, SQL, and agile delivery.",
      },
    ],
    skills: [
      { category: "Frontend", items: ["React", "React Native", "Next.js", "TypeScript", "JavaScript", "NX", "Micro Frontends"] },
      { category: "Backend", items: ["C#", ".NET Framework", "Python", "SQL", "MySQL", "MongoDB"] },
      { category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "Azure DevOps", "CI/CD"] },
      { category: "Testing & Quality", items: ["Cypress.io", "Jest", "SonarQube"] },
    ],
    projects: [
      {
        ...sharedProjects["smart-note"],
        type: "React Native (Expo)",
        description: "AI-powered note-taking with intelligent organization and semantic search.",
      },
      {
        ...sharedProjects["study-smarter"],
        type: "React web app",
        description: "A personalized study platform that uses AI to generate flashcards and quizzes.",
      },
      {
        ...sharedProjects["ai-video-generator"],
        type: "Full-stack web",
        description: "An end-to-end AI video generation platform for content creators.",
      },
    ],
  },
  de: {
    personalInfo: {
      name: "Barbar Ahmad",
      title: "Lead Softwareentwickler",
      location: "Frankfurt am Main, Deutschland",
      linkedInUrl: "https://www.linkedin.com/in/barbar-ahmad",
      bio: "Leidenschaftlicher Softwareentwickler mit mehr als sieben Jahren Erfahrung in der Entwicklung skalierbarer Web- und Mobile-Anwendungen. Bei Marex verantworte ich aktuell UI/UX und Frontend-Entwicklung mit Fokus auf React, TypeScript und moderne Architekturen. Komplexe Probleme zu lösen und Teams zu starken Ergebnissen zu führen, treibt mich an.",
    },
    achievements: [
      "Produktionsfehler durch gezielte Teststrategien um 40 % reduziert",
      "SDLC-Dashboards für mehr Transparenz bei Auslieferung und Teammetriken entwickelt",
      "Ein Batch-Zahlungssystem für Transaktionen in Millionenhöhe pro Tag entworfen",
      "Die Migration einer geschäftskritischen Anwendung von Angular zu React geleitet",
      "Teamübergreifend eingesetzte React-Standards etabliert",
    ],
    experience: [
      {
        role: "Lead Softwareentwickler",
        company: "Marex",
        period: "Dez. 2025 – heute",
        description: "Verantwortung für UI/UX und Frontend-Entwicklung des neuen Produkts Neon Payments.",
      },
      {
        role: "Lead Softwareentwickler",
        company: "StoneX Group",
        period: "Jan. 2023 – Nov. 2025",
        description: "Leitung der Frontend-Entwicklung für Handelsplattformen mit React, TypeScript und Micro-Frontend-Architektur. Mentoring und technische Verantwortung für ein achtköpfiges Engineering-Team.",
      },
      {
        role: "Softwareentwickler",
        company: "StoneX Group",
        period: "März 2021 – Dez. 2022",
        description: "Entwicklung und Wartung von Handelsanwendungen mit React, .NET und Azure. Einführung von CI/CD-Pipelines und Verbesserung der Codequalität mit SonarQube.",
      },
      {
        role: "Full-Stack-Entwickler",
        company: "StoneX Group",
        period: "Sep. 2020 – Feb. 2021",
        description: "Entwicklung von Full-Stack-Funktionen mit C#, .NET Framework und React in enger Zusammenarbeit mit interdisziplinären Teams.",
      },
      {
        role: "Dualer Student",
        company: "IBM",
        period: "Okt. 2017 – Aug. 2020",
        description: "Mitarbeit an Enterprise-Softwarelösungen parallel zum Studium mit Schwerpunkten in Python, SQL und agiler Entwicklung.",
      },
    ],
    skills: [
      { category: "Frontend", items: ["React", "React Native", "Next.js", "TypeScript", "JavaScript", "NX", "Micro Frontends"] },
      { category: "Backend", items: ["C#", ".NET Framework", "Python", "SQL", "MySQL", "MongoDB"] },
      { category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "Azure DevOps", "CI/CD"] },
      { category: "Tests & Qualität", items: ["Cypress.io", "Jest", "SonarQube"] },
    ],
    projects: [
      {
        ...sharedProjects["smart-note"],
        type: "React Native (Expo)",
        description: "KI-gestützte Notizen mit intelligenter Organisation und semantischer Suche.",
      },
      {
        ...sharedProjects["study-smarter"],
        type: "React-Web-App",
        description: "Eine personalisierte Lernplattform, die mit KI Karteikarten und Quizfragen erstellt.",
      },
      {
        ...sharedProjects["ai-video-generator"],
        type: "Full-Stack-Web",
        description: "Eine durchgängige Plattform zur KI-gestützten Videogenerierung für Content Creator.",
      },
    ],
  },
} as const;

export function getPortfolioData(locale: Locale) {
  return portfolioData[locale];
}
