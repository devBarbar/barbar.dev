import { Linkedin, Rss, Youtube } from "lucide-react";

import { getPortfolioData } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { getFeedPath } from "@/lib/seo";
import { youtubeChannel } from "@/lib/youtube";

export default function Footer({ locale }: { locale: Locale }) {
    const year = new Date().getFullYear();
    const { personalInfo } = getPortfolioData(locale);
    const { blog, footer, nav } = getDictionary(locale);

    return (
        <footer className="border-t border-slate-800 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            {personalInfo.name}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            {footer.tagline}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={getFeedPath(locale)}
                            aria-label={blog.rssLabel}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 shadow-lg transition-all hover:scale-110 hover:bg-orange-600 hover:text-white"
                        >
                            <Rss aria-hidden="true" className="h-5 w-5" />
                        </a>
                        <a
                            href={personalInfo.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-lg"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href={youtubeChannel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={nav.youtube}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 shadow-lg transition-all hover:scale-110 hover:bg-red-600 hover:text-white"
                        >
                            <Youtube aria-hidden="true" className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
                    <p>© {year} {personalInfo.name}. {footer.rights}</p>
                </div>
            </div>
        </footer>
    );
}
