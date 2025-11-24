import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 text-primary-foreground hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:border-primary",
            secondary: "bg-secondary/10 border border-secondary/30 text-secondary-foreground hover:bg-secondary/20 hover:border-secondary/50",
            ghost: "bg-transparent border border-transparent text-muted-foreground hover:text-white hover:bg-white/5",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-8 py-4 text-base",
            lg: "px-10 py-6 text-lg",
        };

        return (
            <Button
                ref={ref}
                className={cn(
                    "relative overflow-hidden font-heading font-bold uppercase tracking-widest transition-all duration-300",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Scanline effect */}
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] translate-y-[-100%] group-hover:animate-scanline pointer-events-none" />

                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </Button>
        );
    }
);

ActionButton.displayName = "ActionButton";
