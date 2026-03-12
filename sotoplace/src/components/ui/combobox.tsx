"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlass, Check, CaretDown, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  allowCustom?: boolean; // allow typing a value not in the list
}

export function Combobox({
  options, value, onChange, placeholder = "Выбрать...",
  searchPlaceholder = "Поиск...", emptyText = "Ничего не найдено",
  className, allowCustom = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function select(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setSearch("");
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-10 w-full flex items-center justify-between rounded-[var(--radius-md)] border bg-surface px-3 text-sm transition-colors",
          open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
          !selected && "text-text-tertiary"
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <span onClick={clear} className="p-0.5 text-text-tertiary hover:text-text-primary rounded">
              <X size={12} />
            </span>
          )}
          <CaretDown size={14} className={cn("text-text-tertiary transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[220px] rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-[var(--radius-md)] border border-border bg-subtle pl-8 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-text-tertiary">{emptyText}</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => select(opt.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-subtle transition-colors text-left",
                    value === opt.value && "bg-primary-light"
                  )}
                >
                  <div className="min-w-0">
                    <span className={cn("block truncate", value === opt.value ? "font-medium text-primary" : "text-text-primary")}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-xs text-text-tertiary">{opt.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {opt.badge && (
                      <span className="text-[10px] font-medium text-text-tertiary bg-subtle px-1.5 py-0.5 rounded">{opt.badge}</span>
                    )}
                    {value === opt.value && <Check size={14} className="text-primary" />}
                  </div>
                </button>
              ))
            )}
            {allowCustom && search.trim() && !filtered.find((o) => o.label.toLowerCase() === search.toLowerCase()) && (
              <>
                <div className="border-t border-border my-1" />
                <button
                  type="button"
                  onClick={() => select(search.trim())}
                  className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-subtle transition-colors"
                >
                  Добавить «{search.trim()}»
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
