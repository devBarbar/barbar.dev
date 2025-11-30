/**
 * About/CV Section Data Model
 *
 * Contains all personal information, achievements, experience, education,
 * and skills data for the About section on the homepage.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface Achievement {
  id: string;
  text: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  inProgress: boolean;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface AboutData {
  name: string;
  title: string;
  location: string;
  linkedInUrl: string;
  bio: string;
  achievements: Achievement[];
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

// ============================================================================
// DATA
// ============================================================================

export const aboutData: AboutData = {
  name: "Barbar Ahmad",
  title: "Lead Software Engineer",
  location: "Frankfurt, Germany",
  linkedInUrl: "https://www.linkedin.com/in/barbar-ahmad",
  bio: "Passionate software engineer with 7+ years of experience building scalable web and mobile applications. Currently leading frontend development at StoneX Group, specializing in React, TypeScript, and micro-frontend architectures. I thrive on solving complex problems and mentoring teams to deliver high-quality software.",

  achievements: [
    {
      id: "achievement-1",
      text: "Reduced production bugs by 40% through implementation of comprehensive testing strategies",
    },
    {
      id: "achievement-2",
      text: "Built SDLC dashboards that improved team visibility and delivery metrics",
    },
    {
      id: "achievement-3",
      text: "Architected batch payment system processing millions in daily transactions",
    },
    {
      id: "achievement-4",
      text: "Led Angular-to-React migration, rescuing a critical legacy application",
    },
    {
      id: "achievement-5",
      text: "Established React coding standards adopted across multiple teams",
    },
  ],

  experience: [
    {
      id: "exp-1",
      role: "Lead Software Engineer",
      company: "StoneX Group",
      period: "Jan 2023 - Present",
      description:
        "Leading frontend development for trading platforms using React, TypeScript, and micro-frontend architecture. Mentoring junior developers and driving technical decisions for a team of 8 engineers.",
    },
    {
      id: "exp-2",
      role: "Software Developer",
      company: "StoneX Group",
      period: "Mar 2021 - Dec 2022",
      description:
        "Developed and maintained trading applications using React, .NET, and Azure. Implemented CI/CD pipelines and improved code quality through SonarQube integration.",
    },
    {
      id: "exp-3",
      role: "Fullstack Developer",
      company: "StoneX Group",
      period: "Sep 2020 - Feb 2021",
      description:
        "Built full-stack features using C#, .NET Framework, and React. Collaborated with cross-functional teams to deliver customer-facing trading tools.",
    },
    {
      id: "exp-4",
      role: "Corporate Student (Werkstudent)",
      company: "IBM",
      period: "Oct 2017 - Aug 2020",
      description:
        "Worked on enterprise software solutions while completing studies. Gained experience in Python, SQL, and agile methodologies.",
    },
  ],

  education: [
    {
      id: "edu-1",
      degree: "B.Sc. Computer Science (Informatik)",
      institution: "Frankfurt University of Applied Sciences",
      period: "2023 - Present",
      inProgress: true,
    },
    {
      id: "edu-2",
      degree: "B.Sc. Computer Science (Informatik)",
      institution: "Technische Hochschule Nürnberg",
      period: "2017 - 2020",
      inProgress: false,
    },
  ],

  skills: [
    {
      category: "Frontend",
      skills: [
        "React",
        "React Native",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "NX",
        "Micro Frontends",
      ],
    },
    {
      category: "Backend",
      skills: ["C#", ".NET Framework", "Python", "SQL", "MySQL", "MongoDB"],
    },
    {
      category: "DevOps & Cloud",
      skills: ["Docker", "Kubernetes", "Azure DevOps", "CI/CD"],
    },
    {
      category: "Testing & Quality",
      skills: ["Cypress.io", "Jest", "SonarQube"],
    },
  ],
};

/**
 * Get the about data
 * This is a simple getter for now, but could be extended
 * to fetch from an API or CMS in the future.
 */
export function getAboutData(): AboutData {
  return aboutData;
}
