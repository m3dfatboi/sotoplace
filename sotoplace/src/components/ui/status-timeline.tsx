"use client";

import { cn } from "@/lib/cn";
import { Check } from "@phosphor-icons/react";

export interface TimelineStep {
  label: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <div className={cn("flex items-center gap-0 w-full", className)}>
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium shrink-0",
                "transition-colors duration-[var(--duration-normal)]",
                step.status === "completed" && "bg-success text-white",
                step.status === "current" && "bg-primary text-white ring-4 ring-primary/20",
                step.status === "upcoming" && "bg-subtle text-text-tertiary border border-border"
              )}
            >
              {step.status === "completed" ? (
                <Check weight="bold" size={14} />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "text-[11px] font-medium whitespace-nowrap",
                step.status === "current"
                  ? "text-primary"
                  : step.status === "completed"
                    ? "text-text-secondary"
                    : "text-text-tertiary"
              )}
            >
              {step.label}
            </span>
            {step.date && (
              <span className="text-[10px] text-text-tertiary">{step.date}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 mt-[-20px]",
                step.status === "completed" ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
