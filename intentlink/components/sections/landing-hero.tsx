"use client";

import { ActionButton } from "@/components/ui/action-button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
    ArrowRight,
    BookOpen,
    Sparkles,
    Shield,
    Zap,
    Coins
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function LandingHero() {
    return (
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <StarsBackground starDensity={0.0002} className="opacity-80" />
                <ShootingStars
                    starColor="#00f0ff"
                    trailColor="#bd00ff"
                    minSpeed={15}
                    maxSpeed={25}
                />
                <BackgroundBeams className="opacity-40" />
            </div>

            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70 pointer-events-none z-1" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none z-1" />

            {/* Content wrapper */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">

                {/* Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 inline-flex items-center px-4 py-2 rounded-full border border-primary/50 bg-primary/20 backdrop-blur-md shadow-lg shadow-primary/20"
                >
                    <Sparkles className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm font-heading tracking-wider text-white font-semibold">
                        The Future of DeFi is Here
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] relative z-10"
                >
                    Your Copilot <br />
                    <span className="relative inline-block">
                        <span className="absolute inset-0 blur-2xl text-primary opacity-50">for DeFi</span>
                        <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-secondary animate-gradient-x drop-shadow-[0_0_50px_rgba(0,240,255,0.8)] pb-2">
                            for DeFi
                        </span>
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="text-gray-300 text-xl md:text-2xl max-w-3xl mb-12 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                >
                    Turn your words into profitable transactions. Stake, swap, and earn with
                    <span className="text-primary font-medium"> natural language</span>—no gas fees, no complexity.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 mb-16 items-center"
                >
                    <Link href="/app">
                        <ActionButton size="lg" className="text-lg px-10 py-6 min-w-[240px]">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Launch App
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </ActionButton>
                    </Link>
                    <button
                        className="group px-10 py-6 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white font-heading font-bold uppercase tracking-widest text-lg hover:border-white/40 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 min-w-[240px]"
                        onClick={() => alert('Documentation coming soon!')}
                    >
                        <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        Read Docs
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-sans tracking-normal normal-case">
                            Soon
                        </span>
                    </button>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">AI Security Validated</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary">Gasless Transactions</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
                        <Coins className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-secondary">Multi-Chain Support</span>
                    </div>
                </motion.div>

                {/* Chains Supported */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.0 }}
                    className="mt-16 pt-8 border-t border-white/10"
                >
                    <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">Supported Networks</p>
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <span className="text-2xl">🔷</span>
                            <span className="font-heading font-semibold">BlockDAG</span>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <span className="text-2xl">🟣</span>
                            <span className="font-heading font-semibold">Polygon</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
