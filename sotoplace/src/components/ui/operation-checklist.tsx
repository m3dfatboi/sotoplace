"use client";

import { useState } from "react";
import { Check, Clock, Warning, Lock } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";

export type OperationType = "TR" | "OK" | "UP" | "SK" | "SB";

export interface Operation {
  type: OperationType;
  status: "pending" | "in_progress" | "done" | "blocked";
  assignee?: string;
  doneAt?: string;
  note?: string;
}

const OP_META: Record<OperationType, { label: string; full: string; color: string }> = {
  TR: { label: "ТР", full: "Технологическая разработка", color: "bg-blue-100 text-blue-700 border-blue-200" },
  OK: { label: "ОК", full: "Оценка качества",            color: "bg-purple-100 text-purple-700 border-purple-200" },
  UP: { label: "УП", full: "Управление производством",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  SK: { label: "СК", full: "Складской контроль",         color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  SB: { label: "СБ", full: "Сборка",                     color: "bg-rose-100 text-rose-700 border-rose-200" },
};

const STATUS_META = {
  pending:     { label: "Ожидает",    icon: Clock,   badge: "default" as const },
  in_progress: { label: "В работе",   icon: Clock,   badge: "warning" as const },
  done:        { label: "Выполнено",  icon: Check,   badge: "success" as const },
  blocked:     { label: "Заблокирован", icon: Lock,  badge: "danger"  as const },
};

interface OperationChecklistProps {
  operations: Operation[];
  onStatusChange?: (type: OperationType, status: Operation["status"]) => void;
  readonly?: boolean;
  compact?: boolean;
}

export function OperationChecklist({ operations, onStatusChange, readonly, compact }: OperationChecklistProps) {
  return (
    <div className={cn("flex flex-col gap-2", compact && "gap-1")}>
      {operations.map((op) => {
        const meta = OP_META[op.type];
        const statusMeta = STATUS_META[op.status];
        const StatusIcon = statusMeta.icon;

        return (
          <div
            key={op.type}
            className={cn(
              "rounded-[var(--radius-lg)] border bg-surface p-3 transition-colors",
              op.status === "done" && "border-emerald-200 bg-emerald-50/50",
              op.status === "blocked" && "border-danger/30 bg-danger/5",
              op.status === "in_progress" && "border-primary/30 bg-primary-light",
              op.status === "pending" && "border-border",
              compact && "py-2"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Op badge */}
              <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-xs font-bold", meta.color)}>
                {meta.label}
              </span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium text-text-primary truncate", compact && "text-xs")}>
                  {meta.full}
                </p>
                {!compact && op.assignee && (
                  <p className="text-xs text-text-tertiary mt-0.5">{op.assignee}</p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                {op.doneAt && !compact && (
                  <span className="text-xs text-text-tertiary">{op.doneAt}</span>
                )}
                <Badge variant={statusMeta.badge} size="sm">
                  <StatusIcon size={11} weight={op.status === "done" ? "bold" : "regular"} />
                  {statusMeta.label}
                </Badge>
              </div>

              {/* Actions (if not readonly) */}
              {!readonly && onStatusChange && op.status !== "done" && (
                <button
                  onClick={() => onStatusChange(op.type, op.status === "pending" ? "in_progress" : "done")}
                  className="shrink-0 rounded-[var(--radius-md)] px-2.5 py-1 text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  {op.status === "pending" ? "Начать" : "Готово"}
                </button>
              )}
            </div>

            {/* Note */}
            {!compact && op.note && (
              <p className="mt-2 text-xs text-text-secondary border-t border-border pt-2">{op.note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Compact inline status row (for deal tables)
interface OperationStatusRowProps {
  operations: Operation[];
  className?: string;
}

export function OperationStatusRow({ operations, className }: OperationStatusRowProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {operations.map((op) => {
        const meta = OP_META[op.type];
        const done = op.status === "done";
        const active = op.status === "in_progress";
        return (
          <span
            key={op.type}
            title={`${meta.full}: ${STATUS_META[op.status].label}`}
            className={cn(
              "inline-flex h-5 w-7 items-center justify-center rounded text-[10px] font-bold border transition-colors",
              done  && "bg-emerald-100 text-emerald-700 border-emerald-200",
              active && "bg-primary-light text-primary border-primary/30",
              !done && !active && "bg-subtle text-text-tertiary border-border"
            )}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}
