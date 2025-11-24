import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-glass-border bg-glass-surface/50 backdrop-blur-xl p-6 transition-all duration-500",
                hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]",
                className
            )}
        >
            {/* Inner Glow Gradient */}
            <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 240, 255, 0.06), transparent 40%)"
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
