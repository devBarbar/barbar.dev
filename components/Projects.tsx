"use client";

import { motion } from "framer-motion";
import { projects } from "../lib/data";
import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
    return (
        <section id="projects" className="py-24 px-4 md:px-6 container mx-auto max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>
                <p className="max-w-2xl text-slate-400 text-lg">
                    A selection of recent work I'm proud of, spanning mobile, web, and AI solutions.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="group relative glass rounded-2xl overflow-hidden border border-slate-800 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2 flex flex-col h-full"
                    >
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                    {project.type}
                                </span>
                                <div className="flex gap-2">
                                    <a href={project.githubUrl} className="text-slate-400 hover:text-white transition-colors" aria-label="Github Repo">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href={project.liveUrl} className="text-slate-400 hover:text-white transition-colors" aria-label="Live Demo">
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
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
