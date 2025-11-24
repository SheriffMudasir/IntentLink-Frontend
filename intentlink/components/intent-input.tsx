"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface IntentInputProps {
    onSubmit: (intent: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function IntentInput({ onSubmit, isLoading, placeholder = "Describe your intent..." }: IntentInputProps) {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                onSubmit(value);
            }
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto group">
            {/* Glowing Border Effect */}
            <div
                className={cn(
                    "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-primary opacity-30 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200",
                    isFocused ? "opacity-100 blur-md" : "opacity-30"
                )}
            />

            <div className="relative flex items-start bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-lg md:text-xl text-white placeholder:text-gray-500 p-4 focus:outline-none resize-none font-mono min-h-[80px]"
                        rows={1}
                    />

                    {/* Blinking Cursor for empty state (optional visual flair) */}
                    {value.length === 0 && !isFocused && (
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="absolute top-5 left-[calc(1rem+12px)] w-2 h-6 bg-primary/50 pointer-events-none"
                        />
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={() => value.trim() && onSubmit(value)}
                    disabled={!value.trim() || isLoading}
                    className={cn(
                        "absolute bottom-4 right-4 p-2 rounded-lg transition-all duration-300 flex items-center justify-center",
                        value.trim()
                            ? "bg-primary text-black hover:bg-primary/80 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                            : "bg-white/5 text-gray-500 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                        <ArrowRight className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Helper Text */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                <span>Press <kbd className="font-mono text-gray-400">Enter</kbd> to execute</span>
                <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-secondary" />
                    AI-Powered Analysis
                </span>
            </div>
        </div>
    );
}
