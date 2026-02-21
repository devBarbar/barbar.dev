"use client";

import { motion } from "framer-motion";
import { personalInfo } from "../lib/data";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center pt-20 overflow-hidden">
            <div className="container relative z-10 flex flex-col items-center px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2 mr-2 self-center">
                            <span className="animate-ping text-blue-400 absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Available for new opportunities
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
                        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{personalInfo.name}</span>
                    </h1>
                    <h2 className="text-xl md:text-3xl text-slate-300 mb-6 font-medium">
                        {personalInfo.title}
                    </h2>
                    <p className="max-w-2xl text-slate-400 text-lg mx-auto mb-10 leading-relaxed">
                        {personalInfo.bio}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <a
                        href="#projects"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                        View Projects
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
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            >
                <a href="#about" className="text-slate-500 hover:text-slate-300 transition-colors">
                    <ChevronDown className="h-8 w-8" />
                </a>
            </motion.div>
        </section>
    );
}
