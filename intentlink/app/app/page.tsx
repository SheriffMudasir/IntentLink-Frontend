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
import { Header } from "@/components/ui/header";
import { CONTRACTS } from "@/config/contracts";
import {
    ArrowRight,
    ShieldCheck,
    ExternalLink,
    CheckCircle,
    Wallet,
    TrendingUp,
    Shield,
    ArrowLeft,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useIntent } from "@/hooks/use-intent";
import { useWallet } from "@/contexts/WalletContext";
import Link from "next/link";

export default function AppPage() {
    const [typedText, setTypedText] = useState("");
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [currentIntent, setCurrentIntent] = useState("");
    const fullText = "Stake 1000 BDAG in the safest farm";

    const { walletAddress, chainId, connectWallet } = useWallet();
    const {
        status,
        chosenCandidate,
        txHash,
        enhancedPlan,
        parsedIntent,
        isApproved,
        isApproving,
        processIntent,
        confirmExecution,
        checkAllowance,
        approveToken,
        reset
    } = useIntent();

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

    // Check Allowance Effect
    useEffect(() => {
        if (status === 'review' && parsedIntent && walletAddress && chainId) {
            const check = async () => {
                const chainContracts = CONTRACTS[chainId];
                if (!chainContracts) return;

                const asset = parsedIntent.asset?.toUpperCase();
                const native = chainId === 1043 ? 'BDAG' : 'POL';

                // Only check for non-native tokens (e.g. USDT)
                if (asset && asset !== native) {
                    let tokenAddress = '';
                    if (asset === 'USDT' || asset === 'MOCKUSDT') {
                        tokenAddress = chainContracts.MockUSDT;
                    }

                    if (tokenAddress) {
                        // Spender is IntentWallet (V2)
                        await checkAllowance(tokenAddress, chainContracts.IntentWallet, parsedIntent.amount.toString(), walletAddress);
                    }
                }
            };
            check();
        }
    }, [status, parsedIntent, walletAddress, chainId]); // Minimal deps

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

    // Handle compound rewards
    const handleCompound = (protocolAddress: string, rewardAmount: string) => {
        const intent = "compound my rewards";
        setCurrentIntent(intent);
        processIntent(intent, walletAddress!, chainId || 1043);
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

    // Helper to determine if approval is needed
    const isApprovalNeeded = () => {
        if (!parsedIntent || !chainId) return false;
        const asset = parsedIntent.asset?.toUpperCase();
        const native = chainId === 1043 ? 'BDAG' : 'POL';
        // If asset is NOT native and NOT approved, we need approval
        return asset !== native && !isApproved;
    };

    const handleApprove = async () => {
        if (!parsedIntent || !chainId) return;
        const chainContracts = CONTRACTS[chainId];
        if (!chainContracts) return;

        let tokenAddress = '';
        const asset = parsedIntent.asset?.toUpperCase();
        if (asset === 'USDT' || asset === 'MOCKUSDT') {
            tokenAddress = chainContracts.MockUSDT;
        }

        if (tokenAddress) {
            await approveToken(tokenAddress, chainContracts.IntentWallet);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

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

                    {/* Back to Home Link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="self-start mb-4"
                    >
                        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 inline-flex items-center px-3 py-1 rounded-full border border-primary/50 bg-primary/20 backdrop-blur-md shadow-lg shadow-primary/20"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2 shadow-lg shadow-primary/50"></span>
                        <span className="text-xs font-heading tracking-wider text-white font-semibold uppercase drop-shadow-lg">
                            Live on BlockDAG & Polygon Amoy
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
                    >
                        What do you want to do?
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-gray-300 text-lg max-w-xl mb-8 font-light"
                    >
                        Type your intent in plain English or select a quick action below
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
                                            Start earning yield on your assets in seconds
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
                            ) : status === 'parsing' || status === 'planning' || status === 'executing' ? (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <GlassCard className="p-8">
                                        <div className="mb-6 text-center">
                                            <p className="text-gray-400 text-sm mb-2">Processing intent:</p>
                                            <p className="text-white font-medium text-lg">&quot;{currentIntent}&quot;</p>
                                        </div>
                                        <ExecutionSteps currentStep={getExecutionStep()} />
                                    </GlassCard>
                                </motion.div>

                                /* Review State - Show Candidate + Confirm */
                            ) : status === 'review' && chosenCandidate ? (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <GlassCard className="p-8">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-heading font-bold text-white mb-2">
                                                Review Your Transaction
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                AI has found the best option for your intent
                                            </p>
                                        </div>

                                        {/* Enhanced Plan Summary */}
                                        {enhancedPlan && (
                                            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                                                <p className="text-white font-medium text-center">
                                                    {enhancedPlan.summary}
                                                </p>
                                            </div>
                                        )}

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                                                <p className="text-xs text-gray-500 uppercase">APY</p>
                                                <p className="text-xl font-bold text-green-400">
                                                    {enhancedPlan?.estimatedApy || `${(chosenCandidate.apy * 100).toFixed(1)}%`}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <Shield className="w-5 h-5 text-primary mb-2" />
                                                <p className="text-xs text-gray-500 uppercase">Safety</p>
                                                <p className="text-xl font-bold text-primary">
                                                    {chosenCandidate.safety_score}/100
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <Wallet className="w-5 h-5 text-secondary mb-2" />
                                                <p className="text-xs text-gray-500 uppercase">TVL</p>
                                                <p className="text-xl font-bold text-white">
                                                    ${(chosenCandidate.tvl / 1_000_000).toFixed(1)}M
                                                </p>
                                            </div>
                                        </div>

                                        {/* Projected Earnings */}
                                        {enhancedPlan?.projectedEarnings && (
                                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                                <p className="text-xs text-gray-400 uppercase mb-3 text-center">Projected Earnings</p>
                                                <div className="grid grid-cols-4 gap-2 text-center">
                                                    {enhancedPlan.projectedEarnings.map((proj) => (
                                                        <div key={proj.period}>
                                                            <p className="text-xs text-gray-500 capitalize">{proj.period}</p>
                                                            <p className="text-sm font-bold text-green-400">{proj.amount_usd}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Warnings */}
                                        {chosenCandidate.warnings.length > 0 && (
                                            <div className="mb-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                                <p className="text-yellow-400 text-sm">
                                                    ⚠️ {chosenCandidate.warnings.join(', ')}
                                                </p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={reset}
                                                className="flex-1 py-3 px-6 rounded-xl border border-white/20 text-gray-400 hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setShowSecurityModal(true)}
                                                className="flex-1 py-3 px-6 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                Security Scan
                                            </button>

                                            {/* Logic for Approval vs Execute */}
                                            {isApprovalNeeded() ? (
                                                <ActionButton
                                                    onClick={handleApprove}
                                                    disabled={isApproving}
                                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                                                >
                                                    {isApproving ? "Approving..." : "Approve Token"}
                                                    {!isApproving && <Check className="ml-2 h-4 w-4" />}
                                                </ActionButton>
                                            ) : (
                                                <ActionButton
                                                    onClick={() => confirmExecution(chainId || 1043, walletAddress!)}
                                                    className="flex-1"
                                                >
                                                    Sign & Execute
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </ActionButton>
                                            )}
                                        </div>
                                    </GlassCard>
                                </motion.div>

                                /* Success State - Show Confirmation */
                            ) : status === 'success' && txHash ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <GlassCard className="p-8 border-green-500/50 bg-green-500/5">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-green-400" />
                                            </div>
                                            <h3 className="text-2xl font-heading font-bold text-white mb-2">
                                                Transaction Confirmed!
                                            </h3>
                                            <p className="text-gray-400 mb-6">
                                                Your intent has been successfully executed on-chain
                                            </p>

                                            {/* Transaction Hash */}
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
                                                <p className="text-xs text-gray-500 uppercase mb-2">Transaction Hash</p>
                                                <a
                                                    href={`https://awakening.bdagscan.com/tx/${txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline font-mono text-sm flex items-center justify-center gap-2"
                                                >
                                                    {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            {/* Portfolio Dashboard */}
                                            {walletAddress && chainId && (
                                                <div className="mb-6">
                                                    <PortfolioDashboard
                                                        walletAddress={walletAddress}
                                                        chainId={chainId}
                                                        compact={true}
                                                        onCompound={handleCompound}
                                                    />
                                                </div>
                                            )}

                                            <ActionButton onClick={reset} className="w-full">
                                                Execute Another Intent
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </motion.div>

                    {/* Trust Indicators */}
                    {walletAddress && (status === 'idle' || status === 'error') && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
                        >
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                AI Security Validated
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-primary">⛽</span>
                                Gasless Transactions
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-secondary">🔐</span>
                                EIP-712 Signatures
                            </span>
                        </motion.div>
                    )}

                    {/* Portfolio Dashboard Sidebar - Always visible when connected */}
                    {walletAddress && chainId && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-8 w-full max-w-3xl"
                        >
                            <PortfolioDashboard
                                walletAddress={walletAddress}
                                chainId={chainId}
                                compact={false}
                                onCompound={handleCompound}
                            />
                        </motion.div>
                    )}

                </div>

                {/* Security Scan Modal */}
                {chosenCandidate && (
                    <SecurityScanModal
                        isOpen={showSecurityModal}
                        onClose={() => setShowSecurityModal(false)}
                        onProceed={() => {
                            setShowSecurityModal(false);
                            confirmExecution(chainId || 1043, walletAddress!);
                        }}
                        protocolName={chosenCandidate.protocol}
                        contractAddress={chosenCandidate.address}
                        safetyScore={chosenCandidate.safety_score}
                        warnings={chosenCandidate.warnings}
                        chainId={chainId || 1043}
                        intent={currentIntent}
                    />
                )}
            </section>
        </div>
    );
}
