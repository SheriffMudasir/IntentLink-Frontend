"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2, Shield, Route, FileSignature, Zap } from "lucide-react";

export type ExecutionStep = 
    | "idle"
    | "parsing"
    | "scanning"
    | "planning" 
    | "signing"
    | "executing"
    | "confirmed";

interface ExecutionStepsProps {
    currentStep: ExecutionStep;
    securityScore?: number;
}

const steps = [
    { id: "parsing", label: "Analyzing", icon: Zap, description: "Understanding your intent" },
    { id: "scanning", label: "Security Check", icon: Shield, description: "Verifying protocol safety" },
    { id: "planning", label: "Optimizing", icon: Route, description: "Finding best route" },
    { id: "signing", label: "Signing", icon: FileSignature, description: "Awaiting your signature" },
    { id: "executing", label: "Executing", icon: Zap, description: "Processing on-chain" },
];

export function ExecutionSteps({ currentStep, securityScore }: ExecutionStepsProps) {
    const getStepStatus = (stepId: string) => {
        const stepOrder = ["parsing", "scanning", "planning", "signing", "executing", "confirmed"];
        const currentIndex = stepOrder.indexOf(currentStep);
        const stepIndex = stepOrder.indexOf(stepId);
        
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "active";
        return "pending";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                {/* Steps */}
                <div className="flex items-center justify-between mb-6">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        const StepIcon = step.icon;
                        
                        return (
                            <div key={step.id} className="flex items-center">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: status === "active" ? 1.1 : 1,
                                            backgroundColor: status === "completed" 
                                                ? "rgb(34 197 94)" 
                                                : status === "active" 
                                                    ? "rgb(0 240 255)" 
                                                    : "rgb(55 65 81)"
                                        }}
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center
                                            ${status === "active" ? "shadow-lg shadow-primary/50" : ""}
                                            ${status === "completed" ? "shadow-lg shadow-green-500/30" : ""}
                                        `}
                                    >
                                        {status === "completed" ? (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        ) : status === "active" ? (
                                            <Loader2 className="w-5 h-5 text-black animate-spin" />
                                        ) : (
                                            <StepIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </motion.div>
                                    
                                    {/* Label (hidden on mobile) */}
                                    <span className={`
                                        hidden md:block mt-2 text-xs font-medium
                                        ${status === "active" ? "text-primary" : status === "completed" ? "text-green-400" : "text-gray-500"}
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                                
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-2 h-0.5 min-w-8">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ 
                                                scaleX: getStepStatus(steps[index + 1].id) !== "pending" ? 1 : 0 
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-green-500 origin-left"
                                        />
                                        <div className="h-full bg-gray-700 -mt-0.5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Current Step Details */}
                <div className="text-center">
                    {steps.map(step => {
                        if (getStepStatus(step.id) !== "active") return null;
                        
                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-2"
                            >
                                <h4 className="text-lg font-semibold text-white">
                                    {step.label}...
                                </h4>
                                <p className="text-sm text-gray-400">
                                    {step.description}
                                </p>
                                
                                {/* Security Score Badge (shown during scanning) */}
                                {step.id === "scanning" && securityScore !== undefined && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30"
                                    >
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-medium">
                                            Security Score: {securityScore}/100
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
