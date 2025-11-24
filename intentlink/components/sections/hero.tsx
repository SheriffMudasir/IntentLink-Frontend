"use client";

import { ActionButton } from "@/components/ui/action-button";
import { IntentInput } from "@/components/intent-input";
import { GlassCard } from "@/components/ui/glass-card";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight, ShieldCheck, ExternalLink, Loader2, CheckCircle, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useIntent } from "@/hooks/use-intent";
import { useWallet } from "@/contexts/WalletContext";

export function Hero() {
    const [typedText, setTypedText] = useState("");
    const fullText = "Stake 1000 BDAG in the safest farm";

    const { walletAddress, chainId, connectWallet } = useWallet();
    const { status, chosenCandidate, txHash, processIntent, confirmExecution, reset } = useIntent();

    // Simple typewriter effect for demo purposes
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) i = 0;
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-20 overflow-hidden">
            
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

            {/* Content wrapper with relative positioning */}
            <div className="relative z-10 flex flex-col items-center">

            {/* Pill Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center px-3 py-1 rounded-full border border-primary/50 bg-primary/20 backdrop-blur-md shadow-lg shadow-primary/20"
            >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2 shadow-lg shadow-primary/50"></span>
                <span className="text-xs font-heading tracking-wider text-white font-semibold uppercase drop-shadow-lg">
                    Live on BlockDAG Awakening Testnet
                </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] [text-shadow:0_2px_20px_rgb(0_0_0/90%),0_4px_40px_rgb(0_0_0/80%)]"
            >
                Your AI Copilot for <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-secondary animate-gradient-x drop-shadow-[0_0_40px_rgba(0,240,255,0.5)]">
                    Secure Multi-Chain DeFi
                </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [text-shadow:0_2px_15px_rgb(0_0_0/90%)]" 
            >
                Forget gas, slippage, and complex bridges. Just state your intent,
                and let our AI execute the optimal path across the BlockDAG ecosystem.
            </motion.p>

            {/* Intent Input / Status Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="w-full max-w-3xl mb-12 min-h-[200px]"
            >
                <AnimatePresence mode="wait">
                    {!walletAddress ? (
                        <motion.div
                            key="connect-wallet"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center gap-6 p-12 rounded-2xl border border-primary/30 bg-black/40 backdrop-blur-md"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Wallet className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                                    Connect Your Wallet
                                </h3>
                                <p className="text-gray-400 max-w-md">
                                    To start executing DeFi intents, please connect your Web3 wallet
                                </p>
                            </div>
                            <ActionButton 
                                onClick={connectWallet}
                                size="lg"
                                className="bg-linear-to-r from-primary to-secondary"
                            >
                                <Wallet className="mr-2 h-5 w-5" />
                                CONNECT WALLET
                            </ActionButton>
                        </motion.div>
                    ) : status === 'idle' || status === 'parsing' || status === 'planning' || status === 'error' ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <IntentInput
                                onSubmit={(val) => processIntent(val, walletAddress, chainId || 1043)}
                                placeholder={typedText}
                                isLoading={status === 'parsing' || status === 'planning'}
                            />
                        </motion.div>
                    ) : status === 'review' && chosenCandidate ? (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-left"
                        >
                            <GlassCard className="border-primary/50 bg-primary/5">
                                <h3 className="text-xl font-bold mb-4 text-white">AI Recommended Strategy</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase">Protocol</div>
                                        <div className="text-lg font-bold capitalize">{chosenCandidate.protocol}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase">APY</div>
                                        <div className="text-lg font-bold text-green-400">{(chosenCandidate.apy * 100).toFixed(2)}%</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase">Safety Score</div>
                                        <div className={`text-lg font-bold ${chosenCandidate.safety_score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {chosenCandidate.safety_score}/100
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase">TVL</div>
                                        <div className="text-lg font-bold">${chosenCandidate.tvl.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <ActionButton variant="ghost" onClick={reset}>Cancel</ActionButton>
                                    <ActionButton onClick={confirmExecution}>
                                        Confirm & Execute
                                    </ActionButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : status === 'executing' ? (
                        <motion.div
                            key="executing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <h3 className="text-xl font-bold">Executing On-Chain...</h3>
                            <p className="text-gray-400">Please wait while we submit your transaction.</p>
                        </motion.div>
                    ) : status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <GlassCard className="border-green-500/50 bg-green-500/10">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Execution Confirmed!</h3>
                                    <p className="text-gray-300 mb-4">Your intent has been successfully executed on BlockDAG.</p>

                                    {txHash && (
                                        <>
                                            <div className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-sm text-gray-400 mb-3 break-all">
                                                Tx: {txHash}
                                            </div>
                                            <a
                                                href={`https://awakening.bdagscan.com/tx/${txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-colors"
                                            >
                                                <span className="font-medium">View on Block Explorer</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </>
                                    )}

                                    <ActionButton onClick={reset}>Start New Intent</ActionButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </motion.div>

            {/* Action Area (Only show if idle) */}
            {status === 'idle' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                >
                    <ActionButton size="lg">
                        Launch App <ArrowRight className="ml-2 h-5 w-5" />
                    </ActionButton>
                    <ActionButton variant="ghost" size="lg">
                        Read Docs <ExternalLink className="ml-2 h-5 w-5" />
                    </ActionButton>
                </motion.div>
            )}

            {/* Social Proof / Security Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="mt-12 flex items-center gap-2 text-sm text-gray-500"
            >
                <ShieldCheck className="h-4 w-4 text-secondary" />
                <span>Secured by DAGScanner & Account Abstraction</span>
            </motion.div>
            
            </div> {/* End of content wrapper */}

        </section>
    );
}
