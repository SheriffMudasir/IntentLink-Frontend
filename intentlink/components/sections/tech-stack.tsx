"use client";

import { motion } from "framer-motion";

const techStack = [
    "BlockDAG", "Solidity", "Gemini", "GoPlus", "Ethers.js"
];

export function TechStack() {
    return (
        <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm relative z-10 overflow-hidden">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-16 px-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {[...techStack, ...techStack, ...techStack].map((tech, index) => (
                        <span
                            key={index}
                            className="text-2xl font-heading font-bold text-gray-600 uppercase tracking-widest hover:text-primary transition-colors cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
