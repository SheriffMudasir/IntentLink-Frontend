"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    TrendingUp,
    RefreshCw,
    DollarSign,
    Coins,
    Gift,
    Eye,
    EyeOff,
    Repeat
} from "lucide-react";
import apiService from "@/lib/apiService";
import { PortfolioResponse } from "@/lib/types";
import { useWallet } from "@/contexts/WalletContext";
import { calculateUnlockStatus } from "@/lib/utils";

interface PortfolioDashboardProps {
    walletAddress: string;
    chainId: number;
    compact?: boolean;
    onCompound?: (protocolAddress: string, rewardAmount: string) => void;
}

export function PortfolioDashboard({ walletAddress, chainId, compact = false, onCompound }: PortfolioDashboardProps) {
    const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [balanceVisible, setBalanceVisible] = useState(false);
    const { refreshTrigger } = useWallet(); // Subscribe to chain changes

    const hiddenValue = "••••••";

    const fetchPortfolio = useCallback(async () => {
        if (!walletAddress || !chainId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getPortfolio(chainId, walletAddress);
            setPortfolio(data);
            setLastUpdated(new Date());
        } catch {
            setError('Unable to load portfolio data');
        } finally {
            setLoading(false);
        }
    }, [walletAddress, chainId]);

    // Initial fetch and periodic full refresh
    useEffect(() => {
        fetchPortfolio();
        // Full portfolio refresh every 30 seconds
        const interval = setInterval(fetchPortfolio, 30000);
        return () => clearInterval(interval);
    }, [fetchPortfolio]);

    // Auto-refresh on chain change
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchPortfolio();
        }
    }, [refreshTrigger, fetchPortfolio]);

    // Real-time rewards polling (every 5 seconds)
    useEffect(() => {
        // Only poll if user has active staking
        const hasStaking = portfolio && parseFloat(portfolio.total_staked_value || '0') > 0;
        if (!hasStaking || !walletAddress || !chainId) return;

        const currentRewards = portfolio.total_pending_rewards;

        // Aggressive polling for rewards updates
        const rewardsInterval = setInterval(async () => {
            // Skip if tab is not visible (performance optimization)
            if (document.hidden) return;

            try {
                const data = await apiService.getPortfolio(chainId, walletAddress);
                // Only update if rewards changed
                if (data.total_pending_rewards !== currentRewards) {
                    setPortfolio(data);
                    setLastUpdated(new Date());
                }
            } catch {
                // Continue polling on error
            }
        }, 5000);

        return () => clearInterval(rewardsInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, chainId, portfolio?.total_pending_rewards, portfolio?.total_staked_value]);

    // Use V2 aggregated data if available
    const v2 = portfolio?.v2_aggregated;

    if (loading && !portfolio) {
        return (
            <div className={`${compact ? 'p-4' : 'p-6'} rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 animate-pulse`}>
                <div className="h-6 bg-white/10 rounded w-32 mb-4" />
                <div className="h-10 bg-white/10 rounded w-48 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/10 rounded" />
                    <div className="h-20 bg-white/10 rounded" />
                </div>
            </div>
        );
    }

    if (error && !portfolio) {
        return (
            <div className={`${compact ? 'p-4' : 'p-6'} rounded-xl bg-black/40 backdrop-blur-xl border border-red-500/30`}>
                <p className="text-red-400 text-sm">{error}</p>
                <button
                    onClick={fetchPortfolio}
                    className="mt-2 text-xs text-primary hover:underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!portfolio) return null;

    const totalValue = portfolio.total_portfolio_value_usd;
    const nativeSymbol = portfolio.native_symbol || (portfolio.chain_id === 80002 ? 'POL' : 'BDAG');
    const nativeBalance = parseFloat(v2?.eth_balance || portfolio.native_balance);
    const stakedBalance = parseFloat(v2?.staked_balance || portfolio.total_staked_value);
    const pendingRewards = parseFloat(v2?.pending_rewards || portfolio.total_pending_rewards);
    const currentApy = v2?.current_apy ? parseFloat(v2.current_apy) : 12.0;

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Portfolio</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setBalanceVisible(!balanceVisible)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title={balanceVisible ? "Hide balance" : "Show balance"}
                        >
                            {balanceVisible ? (
                                <Eye className="w-3 h-3 text-gray-400" />
                            ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                            )}
                        </button>
                        <button
                            onClick={fetchPortfolio}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-3 h-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="text-2xl font-bold text-white mb-2">
                    {balanceVisible ? totalValue : hiddenValue}
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-primary" />
                        <span className="text-gray-400">
                            {balanceVisible ? `${nativeBalance.toFixed(4)} ${nativeSymbol}` : hiddenValue}
                        </span>
                    </div>
                    {stakedBalance > 0 && (
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">{currentApy}% APY</span>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Your Portfolio</h2>
                        <p className="text-xs text-gray-500">{portfolio.chain_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={balanceVisible ? "Hide balance" : "Show balance"}
                    >
                        {balanceVisible ? (
                            <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={fetchPortfolio}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Total Value - Robinhood style! */}
            <div className="text-center py-6 mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <p className="text-gray-400 text-sm mb-1">Total Value</p>
                <p className="text-4xl font-bold text-white">
                    {balanceVisible ? totalValue : hiddenValue}
                </p>
                {lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                        Updated {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </div>

            {/* Token Balances - New V2 format */}
            {portfolio.token_balances && portfolio.token_balances.length > 0 ? (
                <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Your Assets</p>
                    <div className="space-y-2">
                        {portfolio.token_balances.map((token, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{token.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-white">{token.symbol}</p>
                                        <p className="text-xs text-gray-500">{token.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">
                                        {balanceVisible ? parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 }) : hiddenValue}
                                    </p>
                                    <p className="text-xs text-gray-400">{balanceVisible ? token.balance_usd : hiddenValue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Fallback Asset Breakdown for older API */
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="text-xs text-gray-400">Native Balance</span>
                        </div>
                        <p className="text-xl font-bold text-white">
                            {balanceVisible ? nativeBalance.toFixed(4) : hiddenValue}
                        </p>
                        <p className="text-xs text-gray-500">{nativeSymbol}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">USDT Balance</span>
                        </div>
                        <p className="text-xl font-bold text-white">
                            {balanceVisible ? `$${parseFloat(portfolio.usdt_balance || '0').toFixed(2)}` : hiddenValue}
                        </p>
                        <p className="text-xs text-gray-500">USDT</p>
                    </div>
                </div>
            )}

            {/* Active Staking Position */}
            {stakedBalance > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Active Staking</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {balanceVisible ? `${stakedBalance.toFixed(4)} MockUSDT` : hiddenValue}
                            </p>
                            <p className="text-xs text-gray-400">
                                {balanceVisible ? (portfolio.total_staked_value_usd || `Staked Amount`) : "Staked Amount"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">
                                {currentApy}%
                            </p>
                            <p className="text-xs text-gray-400">APY</p>
                        </div>
                    </div>

                    {/* Pending Rewards with Live Indicator */}
                    {pendingRewards > 0 && (
                        <div className="mt-4 pt-4 border-t border-green-500/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-gray-400">Pending Rewards</span>
                                    {/* Live Update Indicator */}
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-xs text-green-400 font-medium">Live</span>
                                    </span>
                                </div>
                                <div className="text-right">
                                    <motion.span
                                        key={pendingRewards}
                                        initial={{ scale: 1.1, color: '#facc15' }}
                                        animate={{ scale: 1, color: '#facc15' }}
                                        transition={{ duration: 0.3 }}
                                        className="text-lg font-bold text-yellow-400"
                                    >
                                        {balanceVisible ? `+${pendingRewards.toFixed(6)} ${nativeSymbol}` : hiddenValue}
                                    </motion.span>
                                    {portfolio.total_pending_rewards_usd && (
                                        <p className="text-xs text-gray-500">{balanceVisible ? portfolio.total_pending_rewards_usd : hiddenValue}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Individual Staking Positions */}
            {portfolio.staking_positions.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Positions</p>
                    {portfolio.staking_positions.map((position, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-gray-800/30 border border-white/5 space-y-3"
                        >
                            {/* Position Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-white">{position.protocol_name}</p>
                                    {/* Lock Status Badge */}
                                    {(() => {
                                        const unlockStatus = calculateUnlockStatus(position.unlock_time);
                                        return (
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${unlockStatus.isLocked
                                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    }`}
                                            >
                                                {unlockStatus.message}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <p className="text-sm font-medium text-green-400">{position.apy} APY</p>
                            </div>

                            {/* Position Details */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Staked Amount</p>
                                    <p className="text-sm text-white font-medium">
                                        {balanceVisible
                                            ? `${parseFloat(position.staked_amount).toFixed(4)} ${nativeSymbol}${position.staked_amount_usd ? ` (${position.staked_amount_usd})` : ''}`
                                            : hiddenValue
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Pending Rewards</p>
                                    <p className="text-sm text-yellow-400 font-medium">
                                        {balanceVisible
                                            ? `+${parseFloat(position.pending_rewards).toFixed(6)}${position.pending_rewards_usd ? ` (${position.pending_rewards_usd})` : ''}`
                                            : hiddenValue
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Compound Button */}
                            {parseFloat(position.pending_rewards) > 0 && onCompound && (
                                <button
                                    onClick={() => onCompound(position.protocol_address, position.pending_rewards)}
                                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                >
                                    <Repeat className="w-4 h-4" />
                                    Compound Rewards ({parseFloat(position.pending_rewards).toFixed(6)} {nativeSymbol})
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
