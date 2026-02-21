"use client";

import { personalInfo } from "../lib/data";
import { Linkedin } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            {personalInfo.name}
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm">
                            Building scalable, high-quality software solutions.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={personalInfo.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-lg"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>© {year} {personalInfo.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
