import { ChevronDown, Linkedin } from "lucide-react";

import { getPortfolioData } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

export default function Hero({ locale }: { locale: Locale }) {
    const { personalInfo } = getPortfolioData(locale);
    const { hero } = getDictionary(locale);

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center pt-20 overflow-hidden">
            <div className="container relative z-10 flex flex-col items-center px-4 md:px-6">
                <div className="home-hero-intro text-center">
                    <div className="mx-auto mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2 mr-2 self-center">
                            <span className="animate-ping motion-reduce:animate-none text-blue-400 absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        {hero.availability}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
                        {hero.greeting} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{personalInfo.name}</span>
                    </h1>
                    <h2 className="text-xl md:text-3xl text-slate-300 mb-6 font-medium">
                        {personalInfo.title}
                    </h2>
                    <p className="max-w-2xl text-slate-400 text-lg mx-auto mb-10 leading-relaxed">
                        {personalInfo.bio}
                    </p>
                </div>

                <div className="home-hero-actions flex flex-wrap gap-4 justify-center">
                    <a
                        href="#projects"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                        {hero.viewProjects}
                    </a>
                    <a
                        href={personalInfo.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-sm font-medium text-slate-300 shadow-sm transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-700"
                    >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                    </a>
                </div>
            </div>

            <div className="home-hero-scroll-cue absolute bottom-10 left-1/2 -translate-x-1/2">
                <a
                    href="#about"
                    aria-label={hero.scrollToAbout}
                    className="block animate-bounce text-slate-500 transition-colors hover:text-slate-300 motion-reduce:animate-none"
                >
                    <ChevronDown className="h-8 w-8" />
                </a>
            </div>
        </section>
    );
}
