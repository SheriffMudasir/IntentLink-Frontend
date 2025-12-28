"use client";

import { ActionButton } from "@/components/ui/action-button";
import { IntentInput } from "@/components/intent-input";
import { GlassCard } from "@/components/ui/glass-card";
import { QuickActions } from "@/components/ui/quick-actions";
import { ExecutionSteps } from "@/components/ui/execution-steps";
import { SecurityScanModal } from "@/components/ui/security-scan-modal";
import { PortfolioDashboard } from "@/components/ui/portfolio-dashboard";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { 
    ArrowRight, 
    ShieldCheck, 
    ExternalLink, 
    CheckCircle, 
    Wallet,
    TrendingUp,
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useIntent } from "@/hooks/use-intent";
import { useWallet } from "@/contexts/WalletContext";

export function Hero() {
    const [typedText, setTypedText] = useState("");
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [currentIntent, setCurrentIntent] = useState("");
    const fullText = "Stake 1000 BDAG in the safest farm";

    const { walletAddress, chainId, connectWallet } = useWallet();
    const { status, chosenCandidate, txHash, enhancedPlan, processIntent, confirmExecution, reset } = useIntent();

    // Map internal status to execution step
    const getExecutionStep = (): "idle" | "parsing" | "scanning" | "planning" | "signing" | "executing" | "confirmed" => {
        switch (status) {
            case 'parsing': return 'parsing';
            case 'planning': return 'planning';
            case 'executing': return 'executing';
            case 'success': return 'confirmed';
            default: return 'idle';
        }
    };

    // Handle quick action selection
    const handleQuickAction = (intent: string) => {
        if (walletAddress) {
            setCurrentIntent(intent);
            processIntent(intent, walletAddress, chainId || 1043);
        }
    };

    // Handle custom intent submission
    const handleIntentSubmit = (intent: string) => {
        setCurrentIntent(intent);
        processIntent(intent, walletAddress!, chainId || 1043);
    };

    // Get projection for a specific period from enhanced plan
    const getProjection = (period: string) => {
        if (!enhancedPlan?.projectedEarnings) return null;
        return enhancedPlan.projectedEarnings.find(p => p.period === period);
    };

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
            <div className="relative z-10 flex flex-col items-center w-full">

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
                The Gasless AI Wallet for <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-secondary animate-gradient-x drop-shadow-[0_0_40px_rgba(0,240,255,0.5)]">
                    BlockDAG DeFi
                </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [text-shadow:0_2px_15px_rgb(0_0_0/90%)]" 
            >
                Turn your words into profitable transactions. No gas fees, no complexity—just results.
            </motion.p>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="w-full max-w-3xl mb-8"
            >
                <AnimatePresence mode="wait">
                    {/* Not Connected State */}
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
                                    Start earning yield on your BDAG in seconds
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
                    
                    /* Idle State - Show Quick Actions + Input */
                    ) : status === 'idle' || status === 'error' ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Quick Action Cards */}
                            <QuickActions 
                                onSelectIntent={handleQuickAction}
                                disabled={false}
                                chainId={chainId || 1043}
                            />
                            
                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">or type your intent</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>
                            
                            {/* Intent Input */}
                            <IntentInput
                                onSubmit={handleIntentSubmit}
                                placeholder={typedText}
                                isLoading={false}
                            />
                        </motion.div>
                    
                    /* Processing State - Show Execution Steps */
                    ) : status === 'parsing' || status === 'planning' ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ExecutionSteps 
                                currentStep={getExecutionStep()}
                                securityScore={chosenCandidate?.safety_score}
                            />
                        </motion.div>
                    
                    /* Review State - Show Enhanced Strategy Card */
                    ) : status === 'review' && chosenCandidate ? (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-left"
                        >
                            <GlassCard className="border-primary/50 bg-primary/5">
                                {/* Summary Banner - From Enhanced Plan */}
                                {enhancedPlan?.summary && (
                                    <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-primary/20 to-secondary/10 border border-primary/30">
                                        <p className="text-lg font-medium text-white text-center">
                                            {enhancedPlan.summary}
                                        </p>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white font-heading">AI Recommended Strategy</h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {enhancedPlan?.inputAmount 
                                                ? `Investing ${enhancedPlan.inputAmount} (${enhancedPlan.inputAmountUsd})`
                                                : 'Optimized for maximum yield with security'
                                            }
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowSecurityModal(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span className="hidden sm:inline">Verified Safe</span>
                                        <span className="font-bold">{chosenCandidate.safety_score}/100</span>
                                    </button>
                                </div>
                                
                                {/* Projected Returns Banner - Using Enhanced Plan Data */}
                                <div className="p-4 rounded-xl bg-linear-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-semibold">Projected Earnings</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {getProjection('daily')?.amount || '---'}
                                            </div>
                                            <div className="text-xs text-gray-400">Daily</div>
                                            <div className="text-xs text-green-400">
                                                {getProjection('daily')?.amount_usd || ''}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {getProjection('weekly')?.amount || '---'}
                                            </div>
                                            <div className="text-xs text-gray-400">Weekly</div>
                                            <div className="text-xs text-green-400">
                                                {getProjection('weekly')?.amount_usd || ''}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {getProjection('monthly')?.amount || '---'}
                                            </div>
                                            <div className="text-xs text-gray-400">Monthly</div>
                                            <div className="text-xs text-green-400">
                                                {getProjection('monthly')?.amount_usd || ''}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-green-400">
                                                {enhancedPlan?.estimatedApy || `${(chosenCandidate.apy * 100).toFixed(1)}%`}
                                            </div>
                                            <div className="text-xs text-gray-400">APY</div>
                                            <div className="text-xs text-green-400">
                                                {getProjection('yearly')?.amount_usd || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strategy Details */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">Protocol</div>
                                        <div className="text-lg font-bold capitalize text-white">{chosenCandidate.protocol}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">APY</div>
                                        <div className="text-lg font-bold text-green-400">
                                            {enhancedPlan?.estimatedApy || `${(chosenCandidate.apy * 100).toFixed(2)}%`}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">Safety</div>
                                        <div className={`text-lg font-bold ${chosenCandidate.safety_score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {chosenCandidate.safety_score}/100
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">TVL</div>
                                        <div className="text-lg font-bold text-white">${(chosenCandidate.tvl / 1000000).toFixed(1)}M</div>
                                    </div>
                                </div>

                                {/* Warnings */}
                                {chosenCandidate.warnings && chosenCandidate.warnings.length > 0 && (
                                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6">
                                        <div className="text-xs text-yellow-400 uppercase mb-2">Warnings</div>
                                        {chosenCandidate.warnings.map((warning, i) => (
                                            <div key={i} className="text-sm text-yellow-300/80">{warning}</div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 justify-end">
                                    <ActionButton variant="ghost" onClick={reset}>Cancel</ActionButton>
                                    <ActionButton 
                                        onClick={() => confirmExecution(chainId || 1043, walletAddress!)}
                                        className="bg-linear-to-r from-green-500 to-emerald-600"
                                    >
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Confirm & Earn
                                    </ActionButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    
                    /* Executing State */
                    ) : status === 'executing' ? (
                        <motion.div
                            key="executing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ExecutionSteps 
                                currentStep="executing"
                                securityScore={chosenCandidate?.safety_score}
                            />
                        </motion.div>
                    
                    /* Success State - Portfolio View */
                    ) : status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <GlassCard className="border-green-500/50 bg-green-500/5">
                                <div className="flex flex-col items-center">
                                    {/* Success Icon */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full"></div>
                                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 relative border-2 border-green-500/50">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-3xl font-bold text-white mb-2 font-heading">
                                        🎉 You&apos;re Earning!
                                    </h3>
                                    <p className="text-gray-300 mb-6 text-lg">
                                        Your BDAG is now working for you
                                    </p>

                                    {/* Live Portfolio Dashboard */}
                                    <div className="w-full mb-6">
                                        <PortfolioDashboard 
                                            walletAddress={walletAddress!}
                                            chainId={chainId || 1043}
                                            compact={true}
                                        />
                                    </div>

                                    {/* Transaction Link */}
                                    {txHash && (
                                        <a
                                            href={`https://awakening.bdagscan.com/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 mb-6 rounded-lg bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-all font-medium"
                                        >
                                            <span>View Transaction</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}

                                    <ActionButton onClick={reset} size="lg">
                                        Make Another Trade
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </ActionButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </motion.div>

            {/* Feature Pills - Show only when idle and connected */}
            {status === 'idle' && walletAddress && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                >
                    {[
                        { icon: "⚡", label: "Zero Gas Fees" },
                        { icon: "🛡️", label: "AI Security Scan" },
                        { icon: "🎯", label: "Best Yield Routing" },
                    ].map((feature) => (
                        <div 
                            key={feature.label}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                        >
                            <span>{feature.icon}</span>
                            <span>{feature.label}</span>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Social Proof / Security Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="mt-8 flex items-center gap-2 text-sm text-gray-500"
            >
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Protected by GoPlus Security & Account Abstraction</span>
            </motion.div>
            
            </div> {/* End of content wrapper */}

            {/* Security Modal */}
            {chosenCandidate && (
                <SecurityScanModal
                    isOpen={showSecurityModal}
                    onClose={() => setShowSecurityModal(false)}
                    protocolName={chosenCandidate.protocol}
                    contractAddress={chosenCandidate.address}
                    safetyScore={chosenCandidate.safety_score}
                    warnings={chosenCandidate.warnings || []}
                    chainId={chainId || 1043}
                    intent={currentIntent}
                />
            )}
        </section>
    );
}
