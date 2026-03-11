"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Warning, Info, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: Warning,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/20 bg-surface text-text-primary [&_[data-icon]]:text-success",
  error: "border-danger/20 bg-surface text-text-primary [&_[data-icon]]:text-danger",
  warning: "border-warning/20 bg-surface text-text-primary [&_[data-icon]]:text-warning",
  info: "border-primary/20 bg-surface text-text-primary [&_[data-icon]]:text-primary",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[toast.variant];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-lg)] border p-4 shadow-lg",
        "animate-in slide-in-from-right-full duration-300",
        variantStyles[toast.variant]
      )}
      role="alert"
    >
      <Icon size={18} weight="fill" data-icon className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Закрыть"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    const duration = opts.duration ?? 4000;
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) =>
    toast({ variant: "success", title, description }), [toast]);
  const error = useCallback((title: string, description?: string) =>
    toast({ variant: "error", title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) =>
    toast({ variant: "warning", title, description }), [toast]);
  const info = useCallback((title: string, description?: string) =>
    toast({ variant: "info", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {typeof window !== "undefined" && createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
