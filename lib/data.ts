export const personalInfo = {
    name: "Barbar Ahmad",
    title: "Lead Software Engineer",
    location: "Frankfurt, Germany",
    linkedInUrl: "https://www.linkedin.com/in/barbar-ahmad",
    bio: "Passionate software engineer with 7+ years of experience building scalable web and mobile applications. Currently leading UI/UX and Frontend Development at Marex, specializing in React, TypeScript, and modern architectures. I thrive on solving complex problems and mentoring teams to deliver high-quality software."
};

export const achievements = [
    "Reduced production bugs by 40% through implementation of testing strategies",
    "Built SDLC dashboards improving team visibility and delivery metrics",
    "Architected batch payment system processing millions in daily transactions",
    "Led Angular-to-React migration for a critical legacy application",
    "Established React coding standards adopted across multiple teams"
];

export const experience = [
    {
        role: "Lead Software Engineer",
        company: "Marex",
        period: "Dec 2025 - Present",
        description: "Leading UI/UX and Frontend Development for the new Neon Payments Product."
    },
    {
        role: "Lead Software Engineer",
        company: "StoneX Group",
        period: "Jan 2023 - Nov 2025",
        description: "Leading frontend development for trading platforms using React, TypeScript, and micro-frontend architecture. Mentoring junior developers and driving technical decisions for a team of 8 engineers."
    },
    {
        role: "Software Developer",
        company: "StoneX Group",
        period: "Mar 2021 - Dec 2022",
        description: "Developed and maintained trading applications using React, .NET, and Azure. Implemented CI/CD pipelines and improved code quality through SonarQube integration."
    },
    {
        role: "Fullstack Developer",
        company: "StoneX Group",
        period: "Sep 2020 - Feb 2021",
        description: "Built full-stack features using C#, .NET Framework, and React. Collaborated with cross-functional teams to deliver customer-facing trading tools."
    },
    {
        role: "Corporate Student (Werkstudent)",
        company: "IBM",
        period: "Oct 2017 - Aug 2020",
        description: "Worked on enterprise software solutions while completing studies. Gained experience in Python, SQL, and agile methodologies."
    }
];

export const education = [
    {
        degree: "B.Sc. Computer Science (Informatik)",
        institution: "Frankfurt University of Applied Sciences",
        period: "2023 - Present"
    },
    {
        degree: "B.Sc. Computer Science (Informatik)",
        institution: "Technische Hochschule Nürnberg",
        period: "2017 - 2020"
    }
];

export const skills = [
    {
        category: "Frontend",
        items: ["React", "React Native", "Next.js", "TypeScript", "JavaScript", "NX", "Micro Frontends"]
    },
    {
        category: "Backend",
        items: ["C#", ".NET Framework", "Python", "SQL", "MySQL", "MongoDB"]
    },
    {
        category: "DevOps & Cloud",
        items: ["Docker", "Kubernetes", "Azure DevOps", "CI/CD"]
    },
    {
        category: "Testing & Quality",
        items: ["Cypress.io", "Jest", "SonarQube"]
    }
];

export const projects = [
    {
        slug: "smart-note",
        name: "Smart Note",
        type: "React Native (Expo)",
        description: "AI-powered note-taking app with intelligent organization and search capabilities.",
        features: [
            "Automatically categorizes and tags notes using NLP.",
            "Semantic search capabilities that understand context.",
            "Real-time sync with offline-first architecture."
        ],
        techStack: ["React Native", "Expo", "Appwrite", "OpenAI", "TanStack Query"],
        githubUrl: "#",
        liveUrl: "#"
    },
    {
        slug: "study-smarter",
        name: "Study Smarter",
        type: "React Web App",
        description: "Personalized study platform using AI to generate flashcards and quizzes.",
        features: [
            "Generate comprehensive flashcard sets with spaced repetition.",
            "Dynamically generated quizzes that adapt to your knowledge level.",
            "Real-time collaboration features for study groups."
        ],
        techStack: ["TanStack Start", "Supabase", "OpenAI GPT-4o", "TypeScript"],
        githubUrl: "#",
        liveUrl: "#"
    },
    {
        slug: "ai-video-generator",
        name: "AI Video Generator",
        type: "Full-Stack Web",
        description: "End-to-end video generation platform powered by AI for content creators.",
        features: [
            "Generate engaging video scripts with customizable tone and styles.",
            "Automatically compile videos with AI-selected stock footage and generated voiceovers.",
            "Dashboard for managing multiple video projects."
        ],
        techStack: ["TanStack Start", ".NET 9 API", "MongoDB", "OpenAI"],
        githubUrl: "#",
        liveUrl: "#"
    }
];
