import { cn } from "@/lib/cn";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  const barColor = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[variant];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-subtle",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-[var(--duration-slow)]",
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  );
}
