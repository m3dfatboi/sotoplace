"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, size = "md", children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full rounded-[var(--radius-xl)] bg-surface shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200",
          sizeStyles[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-border">
            <div>
              <h2 id="modal-title" className="text-base font-semibold text-text-primary">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-text-secondary">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-[var(--radius-md)] p-1.5 text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={cn("px-6 py-4", !title && "pt-6")}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-[var(--radius-md)] p-1.5 text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  requireCheckbox?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = "Подтвердить", danger = false, loading,
  requireCheckbox, checked, onCheckedChange,
}: ConfirmDialogProps) {
  const canConfirm = !requireCheckbox || checked;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
            disabled={!canConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">{description}</p>
      {requireCheckbox && (
        <label className="mt-4 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-sm text-text-primary">{requireCheckbox}</span>
        </label>
      )}
    </Modal>
  );
}
