import { ExternalLink, Github } from "lucide-react";

import { getPortfolioData } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

export default function Projects({ locale }: { locale: Locale }) {
    const { projects } = getPortfolioData(locale);
    const { projects: copy } = getDictionary(locale);

    return (
        <section id="projects" className="py-24 px-4 md:px-6 container mx-auto max-w-6xl">
            <div className="home-view-reveal home-view-reveal-project mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{copy.heading}</h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>
                <p className="max-w-2xl text-slate-400 text-lg">
                    {copy.introduction}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div
                        key={project.slug}
                        className="home-view-reveal home-view-reveal-project home-project-card group relative glass rounded-2xl overflow-hidden border border-slate-800 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2 motion-reduce:hover:translate-y-0 flex flex-col h-full"
                    >
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                    {project.type}
                                </span>
                                <div className="flex gap-2">
                                    <a
                                        href={project.githubUrl}
                                        className="text-slate-400 hover:text-white transition-colors"
                                        aria-label={`${copy.githubLabel} ${project.name}`}
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={project.liveUrl}
                                        className="text-slate-400 hover:text-white transition-colors"
                                        aria-label={`${copy.liveLabel} ${project.name}`}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {project.name}
                            </h3>

                            <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                                {project.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/50">
                                    {project.techStack.map((tech, tIdx) => (
                                        <span key={tIdx} className="text-xs text-slate-300 font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
