"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { CaretDown, Check, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ options, value, onChange, placeholder = "Выбрать...", label, error, disabled, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      {label && <label className="mb-1.5 block text-[13px] font-medium text-text-primary">{label}</label>}
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-[var(--radius-md)] border bg-surface px-3 text-sm transition-colors",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:bg-subtle disabled:text-text-tertiary disabled:cursor-not-allowed",
          error ? "border-danger" : "border-border hover:border-border-strong",
          open && "border-primary ring-2 ring-primary/20"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("truncate", !selected && "text-text-tertiary")}>
          {selected ? selected.label : placeholder}
        </span>
        <CaretDown size={14} className={cn("shrink-0 text-text-tertiary transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg overflow-hidden">
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  if (!opt.disabled) { onChange?.(opt.value); setOpen(false); }
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors",
                  opt.disabled ? "text-text-tertiary cursor-not-allowed" : "hover:bg-subtle",
                  opt.value === value && "bg-primary-light text-primary"
                )}
              >
                {opt.icon && <span>{opt.icon}</span>}
                <span className="flex-1">{opt.label}</span>
                {opt.value === value && <Check size={14} weight="bold" />}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

// Multi-select
interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function MultiSelect({ options, value = [], onChange, placeholder = "Выбрать...", label, error }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (v: string) => {
    onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div className="relative" ref={ref}>
      {label && <label className="mb-1.5 block text-[13px] font-medium text-text-primary">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex min-h-9 w-full items-center justify-between rounded-[var(--radius-md)] border bg-surface px-3 py-1.5 text-sm transition-colors",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-danger" : "border-border hover:border-border-strong",
          open && "border-primary ring-2 ring-primary/20"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 ? (
            <span className="text-text-tertiary">{placeholder}</span>
          ) : (
            value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary-light text-primary px-2 py-0.5 text-xs font-medium">
                  {opt?.label}
                  <button onClick={(e) => { e.stopPropagation(); toggle(v); }} className="hover:text-primary/60">
                    <X size={10} />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <CaretDown size={14} className={cn("shrink-0 text-text-tertiary ml-2 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-subtle transition-colors"
              >
                <div className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                  value.includes(opt.value) ? "bg-primary border-primary" : "border-border"
                )}>
                  {value.includes(opt.value) && <Check size={10} weight="bold" className="text-white" />}
                </div>
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
