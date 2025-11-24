"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Brain, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "AI Intent Parser",
        description: "Our LLM understands natural language and converts it into executable on-chain transactions.",
        icon: Brain,
        colSpan: "md:col-span-2",
        bg: "bg-purple-500/10"
    },
    {
        title: "DAGScanner Security",
        description: "Real-time contract auditing before every transaction.",
        icon: Shield,
        colSpan: "md:col-span-1",
        bg: "bg-blue-500/10"
    },
    {
        title: "Multi-Chain",
        description: "Seamlessly operate across BlockDAG, Polygon, and Ethereum.",
        icon: Globe,
        colSpan: "md:col-span-1",
        bg: "bg-cyan-500/10"
    },
    {
        title: "Flash Execution",
        description: "Optimized routing for minimal slippage and maximum speed.",
        icon: Zap,
        colSpan: "md:col-span-2",
        bg: "bg-yellow-500/10"
    }
];

export function Features() {
    return (
        <section className="py-24 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
                        Powered by <span className="text-secondary">Next-Gen Tech</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={feature.colSpan}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className={`h-full ${feature.bg} hover:bg-opacity-20`}>
                                <div className="flex flex-col h-full justify-between">
                                    <div className="mb-6">
                                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </div>

                                    {/* Decorative line */}
                                    <div className="w-full h-1 bg-gradient-to-r from-white/10 to-transparent rounded-full" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
