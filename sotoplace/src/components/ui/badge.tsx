import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "secondary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-subtle text-text-secondary",
  primary: "bg-primary-light text-[var(--color-primary-700)]",
  success: "bg-success-light text-[var(--color-success-700)]",
  warning: "bg-warning-light text-[var(--color-warning-700)]",
  danger: "bg-danger-light text-[var(--color-danger-700)]",
  secondary: "bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-text-tertiary",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  secondary: "bg-secondary",
};

export function Badge({ variant = "default", children, dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2.5 py-0.5",
        "text-xs font-medium leading-4 tracking-[0.02em]",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
