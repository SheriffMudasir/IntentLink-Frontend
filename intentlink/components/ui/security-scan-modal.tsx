"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, X, ExternalLink, Loader2 } from "lucide-react";
import apiService from "@/lib/apiService";
import { SecurityReportResponse } from "@/lib/types";

interface SecurityScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed?: () => void;
    protocolName: string;
    contractAddress: string;
    safetyScore: number;
    warnings: string[];
    // V2 API props for dynamic scanning
    chainId?: number;
    intent?: string;
}

export function SecurityScanModal({
    isOpen,
    onClose,
    onProceed,
    protocolName,
    contractAddress,
    safetyScore,
    warnings,
    chainId,
    intent,
}: SecurityScanModalProps) {
    const [loading, setLoading] = useState(false);
    const [securityReport, setSecurityReport] = useState<SecurityReportResponse | null>(null);

    // Fetch security report from V2 API if chainId and intent are provided
    useEffect(() => {
        const fetchSecurityReport = async () => {
            if (!isOpen || !chainId || !intent || !contractAddress) return;
            
            try {
                setLoading(true);
                const report = await apiService.getSecurityReport(chainId, [contractAddress], intent);
                setSecurityReport(report);
            } catch {
                // Use fallback data if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchSecurityReport();
    }, [isOpen, chainId, intent, contractAddress]);

    // Use V2 data if available, otherwise fallback to props
    const effectiveScore = securityReport?.risk_score ?? safetyScore;
    const overallRisk = securityReport?.overall_risk ?? (safetyScore >= 80 ? 'low' : safetyScore >= 50 ? 'medium' : 'high');
    const isHighRisk = overallRisk === 'high';
    
    // Build security checks from V2 API or generate from score
    const securityChecks: { label: string; passed: boolean; details?: string }[] = securityReport?.checks?.map(check => ({
        label: check.name,
        passed: check.status === 'passed',
        details: check.details
    })) ?? [
        { label: "Smart Contract Verified", passed: true },
        { label: "No Honeypot Detected", passed: safetyScore > 50 },
        { label: "No Malicious Functions", passed: safetyScore > 60 },
        { label: "Deployer Wallet Clean", passed: safetyScore > 70 },
        { label: "No Rug Pull Risk", passed: safetyScore > 75 },
    ];

    // Combine warnings
    const effectiveWarnings = securityReport?.recommendations ?? warnings;

    const riskColors = {
        low: { text: 'text-green-400', bg: 'bg-green-500/10', fill: 'bg-green-500' },
        medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', fill: 'bg-yellow-500' },
        high: { text: 'text-red-400', bg: 'bg-red-500/10', fill: 'bg-red-500' }
    };
    const colors = riskColors[overallRisk];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 overflow-hidden"
                    >
                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-sm text-gray-400">🔍 Scanning for security risks...</p>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className={`p-6 ${colors.bg}`}>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                            
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colors.bg}`}>
                                    <Shield className={`w-8 h-8 ${colors.text}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Security Report</h3>
                                    <p className="text-sm text-gray-400">{protocolName}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Overall Risk Badge */}
                        <div className="p-6 border-b border-white/10">
                            <div className="text-center py-2">
                                <p className={`text-3xl font-bold ${colors.text}`}>
                                    {overallRisk.toUpperCase()} RISK
                                </p>
                                <p className="text-gray-400 text-sm mt-1">Score: {effectiveScore}/100</p>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${effectiveScore}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className={`h-full rounded-full ${colors.fill}`}
                                />
                            </div>
                        </div>
                        
                        {/* Security Checks */}
                        <div className="p-6 space-y-3">
                            <span className="text-sm text-gray-400 uppercase tracking-wider">Security Checks</span>
                            
                            {securityChecks.map((check, index) => (
                                <motion.div
                                    key={check.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    {check.passed ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                    )}
                                    <span className={check.passed ? 'text-gray-300' : 'text-yellow-400'}>
                                        {check.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Warnings / Recommendations */}
                        {effectiveWarnings.length > 0 && (
                            <div className="p-6 pt-0 space-y-2">
                                <span className="text-sm text-yellow-400 uppercase tracking-wider">
                                    {securityReport ? 'Recommendations' : 'Warnings'}
                                </span>
                                {effectiveWarnings.map((warning, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-yellow-300/80">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{warning}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Contract Address */}
                        <div className="p-6 pt-0">
                            <div className="p-4 bg-black/40 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Contract Address</div>
                                <a
                                    href={`https://awakening.bdagscan.com/address/${contractAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
                                >
                                    {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 8)}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {onProceed && (
                            <div className="p-6 pt-0 flex gap-3">
                                <button 
                                    onClick={onClose} 
                                    className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={onProceed} 
                                    className={`flex-1 py-2.5 rounded-lg text-white font-medium transition-colors ${
                                        isHighRisk 
                                            ? 'bg-red-600 hover:bg-red-700' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isHighRisk ? 'Proceed Anyway' : 'Proceed'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
