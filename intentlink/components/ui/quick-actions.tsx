"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowLeftRight, Landmark, TrendingUp, Gift, LucideIcon } from "lucide-react";
import apiService from "@/lib/apiService";
import { QuickAction } from "@/lib/types";

interface QuickActionsProps {
    onSelectIntent: (intent: string) => void;
    disabled?: boolean;
    chainId?: number;
}

// Icon mapping from backend icon strings to Lucide icons
const iconMap: Record<string, LucideIcon> = {
    '📈': TrendingUp,
    '💰': Landmark,
    '🔄': ArrowLeftRight,
    '📊': TrendingUp,
    '🎁': Gift,
    '🚀': Rocket,
};

// Color schemes by category/risk level
const colorSchemes: Record<string, { color: string; bgColor: string; borderColor: string; hoverBorder: string }> = {
    stake: {
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        hoverBorder: "hover:border-green-500/60",
    },
    swap: {
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        hoverBorder: "hover:border-blue-500/60",
    },
    lend: {
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        hoverBorder: "hover:border-purple-500/60",
    },
    maximize: {
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        hoverBorder: "hover:border-amber-500/60",
    },
    default: {
        color: "from-primary to-secondary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/30",
        hoverBorder: "hover:border-primary/60",
    },
};

// Fallback actions when API is unavailable
const fallbackActions = [
    {
        id: "stake",
        icon: "🚀",
        label: "Stake BDAG",
        description: "Earn 12% APY",
        intent_template: "Stake 1000 BDAG in the highest yield farm",
        category: "stake",
        estimated_apy: "12%",
        risk_level: "low",
    },
    {
        id: "swap",
        icon: "🔄",
        label: "Swap Tokens",
        description: "Best rates",
        intent_template: "Swap 100 USDT to BDAG at the best rate",
        category: "swap",
        risk_level: "low",
    },
    {
        id: "lend",
        icon: "💰",
        label: "Earn Interest",
        description: "8% APY",
        intent_template: "Lend 500 BDAG to earn interest",
        category: "lend",
        estimated_apy: "8%",
        risk_level: "low",
    },
    {
        id: "maximize",
        icon: "📈",
        label: "Max Yield",
        description: "AI optimized",
        intent_template: "Find the safest way to maximize my BDAG yield",
        category: "maximize",
        risk_level: "medium",
    },
];

export function QuickActions({ onSelectIntent, disabled, chainId = 1043 }: QuickActionsProps) {
    const [actions, setActions] = useState<QuickAction[]>(fallbackActions);
    const [featuredAction, setFeaturedAction] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActions = async () => {
            try {
                setLoading(true);
                const data = await apiService.getQuickActions(chainId);
                setActions(data.actions);
                setFeaturedAction(data.featured_action);
            } catch {
                setActions(fallbackActions);
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, [chainId]);

    const getColorScheme = (action: QuickAction) => {
        return colorSchemes[action.category] || colorSchemes[action.id] || colorSchemes.default;
    };

    const getIcon = (iconStr: string): LucideIcon => {
        return iconMap[iconStr] || Rocket;
    };

    if (loading) {
        return (
            <div className="w-full max-w-3xl mx-auto mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Quick Actions</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse">
                            <div className="w-10 h-10 rounded-lg bg-white/10 mb-3" />
                            <div className="h-4 bg-white/10 rounded w-20 mb-2" />
                            <div className="h-3 bg-white/10 rounded w-16" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Quick Actions</span>
                <div className="flex-1 h-px bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map((action, index) => {
                    const scheme = getColorScheme(action);
                    const IconComponent = getIcon(action.icon);
                    const isFeatured = action.id === featuredAction;

                    return (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectIntent(action.intent_template)}
                            disabled={disabled}
                            className={`
                                group relative p-4 rounded-xl border backdrop-blur-sm
                                ${scheme.bgColor} ${scheme.borderColor} ${scheme.hoverBorder}
                                transition-all duration-300 text-left
                                hover:shadow-lg hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                ${isFeatured ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-black' : ''}
                            `}
                        >
                            {/* Featured Badge */}
                            {isFeatured && (
                                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-[10px] font-bold text-white rounded-full">
                                    HOT
                                </div>
                            )}

                            {/* Gradient Icon */}
                            <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${scheme.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow`}>
                                <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            
                            {/* Label */}
                            <div className="font-semibold text-white text-sm mb-0.5">
                                {action.label}
                            </div>
                            
                            {/* Description */}
                            <div className="text-xs text-gray-400">
                                {action.description}
                            </div>

                            {/* APY Badge */}
                            {action.estimated_apy && (
                                <div className="mt-2 text-xs text-green-400 font-medium">
                                    APY: {action.estimated_apy}
                                </div>
                            )}
                            
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${scheme.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
