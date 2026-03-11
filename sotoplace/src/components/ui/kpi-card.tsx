import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  subtitle?: string;
  icon?: ReactNode;
  alert?: boolean;
  className?: string;
}

export function KpiCard({ title, value, change, subtitle, icon, alert, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-surface border border-border p-4 shadow-xs",
        alert && "border-danger/30 bg-danger-light",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-text-secondary">{title}</p>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold tracking-[-0.01em] tabular-nums",
          alert ? "text-danger" : "text-text-primary"
        )}
      >
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {change && (
          <span
            className={cn(
              "text-xs font-medium",
              change.positive ? "text-success" : "text-danger"
            )}
          >
            {change.positive ? "↑" : "↓"} {change.value}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-text-tertiary">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
