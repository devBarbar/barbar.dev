"use client";

import { motion, type Variants } from "framer-motion";
import { experience, education, skills, achievements } from "../lib/data";

const slideUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function About() {
    return (
        <section id="about" className="py-24 px-4 md:px-6 container mx-auto max-w-6xl">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideUpVariant}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Experience & Background</h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Experience Timeline */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={slideUpVariant}
                    >
                        <h3 className="text-2xl font-semibold mb-6 flex items-center">
                            <span className="text-blue-400 mr-3">Brief History</span>
                        </h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                            {experience.map((exp, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md transition-colors duration-300 glow z-10">
                                        <div className="w-3 h-3 bg-current rounded-full"></div>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-xl shadow-lg border-slate-800 transition-all hover:border-slate-600 hover:shadow-blue-900/10 hover:-translate-y-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <h4 className="font-bold text-lg text-white">{exp.role}</h4>
                                            <time className="text-sm font-medium text-blue-400">{exp.period}</time>
                                        </div>
                                        <div className="text-slate-300 font-medium mb-3">{exp.company}</div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                <div className="space-y-12">
                    {/* Skills */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={slideUpVariant}
                    >
                        <h3 className="text-2xl font-semibold mb-6">Technical Arsenal</h3>
                        <div className="space-y-6">
                            {skills.map((category, idx) => (
                                <div key={idx} className="glass p-5 rounded-xl border-slate-800">
                                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">{category.category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map((skill, sIdx) => (
                                            <span key={sIdx} className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700 rounded-full hover:border-blue-500/50 hover:text-white hover:bg-blue-900/20 transition-colors">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Key Achievements */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={slideUpVariant}
                    >
                        <h3 className="text-2xl font-semibold mb-6">Key Achievements</h3>
                        <ul className="space-y-4">
                            {achievements.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                                    <span className="text-blue-500 mt-1">▹</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
