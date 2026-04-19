import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "premium-button-primary",
      secondary: "premium-button-secondary",
      outline: "premium-button-outline",
      ghost: "text-slate-600 hover:bg-slate-100",
      glass: "bg-white/20 backdrop-blur-md border border-white/30 text-purple-900 hover:bg-white/30",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm min-h-11",
      md: "px-6 py-2.5 min-h-11",
      lg: "px-8 py-3.5 text-lg font-semibold min-h-12",
      icon: "h-11 w-11 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        {...(isLoading && { "aria-busy": "true" })}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-500",
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
