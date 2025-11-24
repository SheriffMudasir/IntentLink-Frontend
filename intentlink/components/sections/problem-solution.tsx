"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { XCircle, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function ProblemSolution() {
    return (
        <section className="py-24 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
                        The Old Way vs. <span className="text-primary">The Intent Way</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Stop fighting with protocols. Start expressing your goals.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* The Problem */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <GlassCard className="h-full border-red-500/20 bg-red-950/10 hover:border-red-500/40">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                                    <XCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-red-100">Traditional DeFi</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-black/40 border border-red-500/10 font-mono text-sm text-red-300/70">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4" /> Error: Slippage too high
                                    </div>
                                    <div className="opacity-50">
                                        &gt; Approving USDT... <br />
                                        &gt; Swapping on Uniswap... <br />
                                        &gt; Bridging to Polygon... <br />
                                        &gt; Transaction Failed (Out of Gas)
                                    </div>
                                </div>

                                <ul className="space-y-3 text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Complex bridging & gas management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Risk of phishing & bad contracts
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Fragmented liquidity across chains
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* The Solution */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <GlassCard className="h-full border-primary/30 bg-primary/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-white">IntentLink</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-black/40 border border-primary/20 font-mono text-sm text-primary/80">
                                    <div className="flex items-center gap-2 mb-2 text-white">
                                        <Zap className="w-4 h-4 text-yellow-400" /> Intent Executed Successfully
                                    </div>
                                    <div className="opacity-70 text-white/70">
                                        &gt; &quot;Stake 1000 USDC in safest farm&quot; <br />
                                        &gt; AI Analyzed 15 routes <br />
                                        &gt; Auto-bridged & Staked via Aave <br />
                                        &gt; <span className="text-green-400">Confirmed (Tx: 0x8a...2f)</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        One-click execution across any chain
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        AI-powered security checks (GoPlus)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Gas abstraction (Pay in any token)
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
