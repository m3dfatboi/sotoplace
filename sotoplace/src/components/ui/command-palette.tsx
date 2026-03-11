"use client";

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MagnifyingGlass, ArrowElbowDownLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  group?: string;
  shortcut?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export function CommandPalette({ open, onClose, items, placeholder = "Поиск..." }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[activeIndex]?.action(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.group?.toLowerCase().includes(q)
    );
  }, [query, items]);

  // Reset active index on filter change
  useEffect(() => { setActiveIndex(0); }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Group items
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const g = item.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    });
    return map;
  }, [filtered]);

  if (!open) return null;

  let globalIndex = 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-[var(--radius-xl)] border border-border bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <MagnifyingGlass size={18} className="shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[10px] text-text-tertiary font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-text-tertiary">
              Ничего не найдено
            </div>
          ) : (
            Array.from(grouped.entries()).map(([group, groupItems]) => (
              <div key={group}>
                {group && (
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    {group}
                  </div>
                )}
                {groupItems.map((item) => {
                  const idx = globalIndex++;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => { item.action(); onClose(); }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                        idx === activeIndex ? "bg-primary-light text-primary" : "text-text-primary hover:bg-subtle"
                      )}
                    >
                      {item.icon && (
                        <span className={cn("shrink-0", idx === activeIndex ? "text-primary" : "text-text-tertiary")}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-text-tertiary truncate max-w-[140px]">{item.description}</span>
                      )}
                      {item.shortcut && (
                        <span className="flex items-center gap-0.5">
                          {item.shortcut.map((k) => (
                            <kbd key={k} className="px-1.5 py-0.5 rounded border border-border text-[10px] font-mono text-text-tertiary">{k}</kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1"><ArrowElbowDownLeft size={12} /> выбрать</span>
            <span>↑↓ навигация</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
