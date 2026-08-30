import type { Locale } from "@/lib/locales";

const dictionaries = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Blog",
      youtube: "Open devBarbar on YouTube",
      switchLanguage: "Switch language",
      skipToContent: "Skip to content",
      primaryLabel: "Primary navigation",
    },
    hero: {
      availability: "Available for new opportunities",
      greeting: "Hi, I'm",
      viewProjects: "View projects",
      scrollToAbout: "Scroll to the about section",
    },
    about: {
      heading: "Experience & Background",
      history: "Brief History",
      skills: "Technical Arsenal",
      achievements: "Key Achievements",
    },
    projects: {
      heading: "Featured Projects",
      introduction:
        "A selection of recent work I'm proud of, spanning mobile, web, and AI solutions.",
      githubLabel: "View source code for",
      liveLabel: "Open live demo for",
    },
    blog: {
      eyebrow: "Barbar Ahmad's blog",
      title: "Software engineering, career & personal growth",
      introduction:
        "Personal essays and practical notes on software engineering, career, communication, and making meaningful progress.",
      latest: "Latest writing",
      latestIntroduction:
        "Honest reflections and practical ideas from work, technology, and life.",
      viewAll: "View all posts",
      readMore: "Read article",
      minutes: "min read",
      published: "Published",
      updated: "Updated",
      by: "By",
      noPosts: "No posts have been published yet.",
      backToBlog: "Back to all posts",
      readTranslation: "Read this article in German",
      tagsLabel: "Tags",
      videoLabel: "Video",
      breadcrumbsLabel: "Breadcrumbs",
      rssLabel: "Subscribe to the English blog RSS feed",
    },
    footer: {
      tagline: "Building scalable, high-quality software solutions.",
      rights: "All rights reserved.",
    },
    youtube: {
      eyebrow: "On YouTube",
      title: "Ideas beyond the code",
      description:
        "On devBarbar I talk openly about work, personal growth, procrastination, health, and learning to move forward before everything feels perfectly figured out.",
      watchVideo: "Watch on YouTube",
      playVideo: "Play video",
      visitChannel: "Visit the devBarbar channel",
      playerTitle: "Play the latest devBarbar video",
    },
    metadata: {
      title: "Barbar Ahmad | Lead Software Engineer",
      description:
        "Portfolio, blog, and YouTube channel of Barbar Ahmad, Lead Software Engineer in Frankfurt, Germany.",
      blogTitle: "Software Engineering, Career & Personal Growth Blog",
      blogDescription:
        "Personal essays and practical notes from Barbar Ahmad on software engineering, career, communication, and personal growth.",
      ogImageAlt: "Barbar Ahmad — Lead Software Engineer · Engineering Blog",
    },
  },
  de: {
    nav: {
      home: "Start",
      about: "Über mich",
      projects: "Projekte",
      blog: "Blog",
      youtube: "devBarbar auf YouTube öffnen",
      switchLanguage: "Sprache wechseln",
      skipToContent: "Zum Inhalt springen",
      primaryLabel: "Hauptnavigation",
    },
    hero: {
      availability: "Offen für neue Möglichkeiten",
      greeting: "Hallo, ich bin",
      viewProjects: "Projekte ansehen",
      scrollToAbout: "Zum Abschnitt Über mich scrollen",
    },
    about: {
      heading: "Erfahrung & Hintergrund",
      history: "Kurzprofil",
      skills: "Technologien",
      achievements: "Wichtige Erfolge",
    },
    projects: {
      heading: "Ausgewählte Projekte",
      introduction:
        "Eine Auswahl aktueller Arbeiten aus den Bereichen Mobile, Web und KI, auf die ich besonders stolz bin.",
      githubLabel: "Quellcode ansehen für",
      liveLabel: "Live-Demo öffnen für",
    },
    blog: {
      eyebrow: "Barbar Ahmads Blog",
      title: "Softwareentwicklung, Karriere & persönliche Entwicklung",
      introduction:
        "Persönliche Essays und praxisnahe Beiträge über Softwareentwicklung, Karriere, Kommunikation und echten Fortschritt.",
      latest: "Neueste Beiträge",
      latestIntroduction:
        "Offene Gedanken und praktische Ideen aus Arbeit, Technologie und Leben.",
      viewAll: "Alle Beiträge ansehen",
      readMore: "Artikel lesen",
      minutes: "Min. Lesezeit",
      published: "Veröffentlicht",
      updated: "Aktualisiert",
      by: "Von",
      noPosts: "Noch wurden keine Beiträge veröffentlicht.",
      backToBlog: "Zurück zu allen Beiträgen",
      readTranslation: "Diesen Artikel auf Englisch lesen",
      tagsLabel: "Schlagwörter",
      videoLabel: "Video",
      breadcrumbsLabel: "Brotkrümelnavigation",
      rssLabel: "Deutschen Blog-RSS-Feed abonnieren",
    },
    footer: {
      tagline: "Skalierbare Softwarelösungen mit hohem Qualitätsanspruch.",
      rights: "Alle Rechte vorbehalten.",
    },
    youtube: {
      eyebrow: "Auf YouTube",
      title: "Gedanken jenseits des Codes",
      description:
        "Auf devBarbar spreche ich offen über Arbeit, persönliche Entwicklung, Prokrastination, Gesundheit und darüber, anzufangen, bevor sich alles perfekt geklärt anfühlt.",
      watchVideo: "Auf YouTube ansehen",
      playVideo: "Video abspielen",
      visitChannel: "Zum YouTube-Kanal devBarbar",
      playerTitle: "Das neueste Video von devBarbar abspielen",
    },
    metadata: {
      title: "Barbar Ahmad | Lead Softwareentwickler",
      description:
        "Portfolio, Blog und YouTube-Kanal von Barbar Ahmad, Lead Softwareentwickler in Frankfurt am Main.",
      blogTitle: "Blog über Softwareentwicklung, Karriere & persönliche Entwicklung",
      blogDescription:
        "Persönliche Essays und praxisnahe Beiträge von Barbar Ahmad über Softwareentwicklung, Karriere, Kommunikation und persönliche Entwicklung.",
      ogImageAlt: "Barbar Ahmad — Lead Softwareentwickler · Engineering-Blog",
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
