import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-9 w-full rounded-[var(--radius-md)] border bg-surface px-3",
            "text-sm text-text-primary placeholder:text-text-tertiary",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:bg-subtle disabled:text-text-tertiary disabled:cursor-not-allowed",
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border hover:border-border-strong",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
