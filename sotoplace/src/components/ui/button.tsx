import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-[var(--color-primary-700)] shadow-xs",
  secondary:
    "bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] active:bg-[var(--color-secondary-700)] shadow-xs",
  ghost:
    "bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary active:bg-muted",
  danger:
    "bg-danger text-white hover:bg-[var(--color-danger-600)] active:bg-[var(--color-danger-700)] shadow-xs",
  outline:
    "bg-surface border border-border text-text-primary hover:bg-subtle active:bg-muted shadow-xs",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-[var(--radius-md)]",
  md: "h-9 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-10 px-5 text-sm gap-2 rounded-[var(--radius-lg)]",
  icon: "h-9 w-9 rounded-[var(--radius-md)] justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          variantStyles[variant],
          sizeStyles[size],
          loading && "pointer-events-none",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
