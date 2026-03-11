"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  side?: TooltipSide;
  delay?: number;
  disabled?: boolean;
  children: ReactNode;
}

export function Tooltip({ content, side = "top", delay = 400, disabled, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (disabled) return;
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      const gap = 8;
      let top = 0, left = 0;
      if (side === "top")    { top = r.top - gap; left = r.left + r.width / 2; }
      if (side === "bottom") { top = r.bottom + gap; left = r.left + r.width / 2; }
      if (side === "left")   { top = r.top + r.height / 2; left = r.left - gap; }
      if (side === "right")  { top = r.top + r.height / 2; left = r.right + gap; }
      setPos({ top, left });
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const transformMap: Record<TooltipSide, string> = {
    top:    "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
    left:   "translateX(-100%) translateY(-50%)",
    right:  "translateY(-50%)",
  };

  return (
    <>
      <span ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} className="inline-flex">
        {children}
      </span>
      {visible && typeof window !== "undefined" && createPortal(
        <div
          role="tooltip"
          style={{ top: pos.top, left: pos.left, transform: transformMap[side] }}
          className={cn(
            "pointer-events-none fixed z-[9999] max-w-[220px] rounded-[var(--radius-md)]",
            "bg-[var(--color-slate-800)] text-white px-2.5 py-1.5 text-xs font-medium leading-snug shadow-lg",
            "animate-in fade-in duration-100"
          )}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

// Popover — управляемый, с произвольным содержимым
interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Popover({ trigger, content, side = "bottom", align = "start", className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const positionClasses: Record<string, string> = {
    "bottom-start":  "top-full left-0 mt-1",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-1",
    "bottom-end":    "top-full right-0 mt-1",
    "top-start":     "bottom-full left-0 mb-1",
    "top-center":    "bottom-full left-1/2 -translate-x-1/2 mb-1",
    "top-end":       "bottom-full right-0 mb-1",
    "left-start":    "right-full top-0 mr-1",
    "right-start":   "left-full top-0 ml-1",
  };

  const key = `${side}-${align}`;

  return (
    <div className="relative inline-flex" ref={ref}>
      <span onClick={() => setOpen((p) => !p)} className="inline-flex cursor-pointer">
        {trigger}
      </span>
      {open && (
        <div
          className={cn(
            "absolute z-30 rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl",
            "animate-in fade-in zoom-in-95 duration-150",
            positionClasses[key] ?? positionClasses["bottom-start"],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
