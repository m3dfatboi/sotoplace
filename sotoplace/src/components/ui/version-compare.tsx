"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowsLeftRight, Check, X, Clock, User, DownloadSimple, Eye } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { Button } from "./button";

export interface DrawingVersion {
  id: string;
  version: string; // e.g. "v1.0", "v2.3"
  author: string;
  createdAt: string;
  status: "draft" | "review" | "approved" | "rejected";
  comment?: string;
  fileUrl?: string;
  previewUrl?: string;
  changes?: string[]; // list of change descriptions
}

const STATUS_META = {
  draft:    { label: "Черновик",    badge: "default"  as const },
  review:   { label: "На проверке", badge: "warning"  as const },
  approved: { label: "Согласован",  badge: "success"  as const },
  rejected: { label: "Отклонён",    badge: "danger"   as const },
};

interface VersionHistoryProps {
  versions: DrawingVersion[];
  activeId?: string;
  onSelect?: (version: DrawingVersion) => void;
  className?: string;
}

export function VersionHistory({ versions, activeId, onSelect, className }: VersionHistoryProps) {
  return (
    <div className={cn("flex flex-col divide-y divide-border", className)}>
      {versions.map((v) => {
        const meta = STATUS_META[v.status];
        const isActive = v.id === activeId;

        return (
          <button
            key={v.id}
            onClick={() => onSelect?.(v)}
            className={cn(
              "flex items-start gap-3 px-4 py-3 text-left transition-colors",
              isActive ? "bg-primary-light" : "hover:bg-subtle"
            )}
          >
            {/* Version dot */}
            <div className={cn(
              "mt-1 h-2.5 w-2.5 rounded-full shrink-0 border-2",
              v.status === "approved" && "bg-emerald-500 border-emerald-500",
              v.status === "rejected" && "bg-danger border-danger",
              v.status === "review"   && "bg-amber-400 border-amber-400",
              v.status === "draft"    && "bg-text-tertiary border-text-tertiary"
            )} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-text-primary")}>
                  {v.version}
                </span>
                <Badge variant={meta.badge} size="sm">{meta.label}</Badge>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-text-tertiary">
                <span className="flex items-center gap-1"><User size={11} />{v.author}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{v.createdAt}</span>
              </div>
              {v.comment && (
                <p className="mt-1 text-xs text-text-secondary truncate">{v.comment}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Side-by-side diff view
interface VersionCompareProps {
  versions: DrawingVersion[];
  className?: string;
}

export function VersionCompare({ versions, className }: VersionCompareProps) {
  const [leftId, setLeftId]   = useState(versions[1]?.id ?? versions[0]?.id);
  const [rightId, setRightId] = useState(versions[0]?.id);

  const left  = versions.find((v) => v.id === leftId);
  const right = versions.find((v) => v.id === rightId);

  const swapVersions = () => {
    setLeftId(rightId);
    setRightId(leftId);
  };

  const versionOptions = versions.map((v) => ({ value: v.id, label: `${v.version} — ${v.author}` }));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Version selectors */}
      <div className="flex items-center gap-3">
        <VersionSelector versions={versions} value={leftId} onChange={setLeftId} label="Версия A" />
        <button
          onClick={swapVersions}
          className="shrink-0 rounded-[var(--radius-md)] p-2 border border-border hover:bg-subtle transition-colors text-text-secondary"
          title="Поменять местами"
        >
          <ArrowsLeftRight size={16} />
        </button>
        <VersionSelector versions={versions} value={rightId} onChange={setRightId} label="Версия B" />
      </div>

      {/* Compare panels */}
      <div className="grid grid-cols-2 gap-4">
        {[left, right].map((v, i) => v && (
          <VersionPanel key={v.id} version={v} label={i === 0 ? "A" : "B"} />
        ))}
      </div>

      {/* Changes diff */}
      {left && right && (left.changes || right.changes) && (
        <div className="rounded-[var(--radius-lg)] border border-border overflow-hidden">
          <div className="px-4 py-2.5 bg-subtle border-b border-border text-sm font-medium text-text-primary">
            Изменения
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <ChangeList version={left} side="left" />
            <ChangeList version={right} side="right" />
          </div>
        </div>
      )}
    </div>
  );
}

interface VersionSelectorProps {
  versions: DrawingVersion[];
  value?: string;
  onChange: (id: string) => void;
  label: string;
}

function VersionSelector({ versions, value, onChange, label }: VersionSelectorProps) {
  return (
    <div className="flex-1 min-w-0">
      <label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {versions.map((v) => (
          <option key={v.id} value={v.id}>
            {v.version} — {v.author} ({v.createdAt})
          </option>
        ))}
      </select>
    </div>
  );
}

interface VersionPanelProps {
  version: DrawingVersion;
  label: string;
}

function VersionPanel({ version, label }: VersionPanelProps) {
  const meta = STATUS_META[version.status];

  return (
    <div className="rounded-[var(--radius-lg)] border border-border overflow-hidden">
      {/* Preview */}
      <div className="aspect-[4/3] bg-subtle flex items-center justify-center relative">
        {version.previewUrl ? (
          <img src={version.previewUrl} alt={version.version} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-text-tertiary">
            <Eye size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Нет превью</p>
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-full bg-text-primary/80 text-white text-xs font-bold px-2 py-0.5">
          {label}
        </span>
      </div>

      {/* Info */}
      <div className="px-3 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm text-text-primary">{version.version}</span>
          <Badge variant={meta.badge} size="sm">{meta.label}</Badge>
        </div>
        <div className="text-xs text-text-secondary space-y-1">
          <div className="flex items-center gap-1.5"><User size={12} />{version.author}</div>
          <div className="flex items-center gap-1.5"><Clock size={12} />{version.createdAt}</div>
        </div>
        {version.comment && (
          <p className="text-xs text-text-secondary italic border-t border-border pt-2">{version.comment}</p>
        )}
        {version.fileUrl && (
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(version.fileUrl)}>
            <DownloadSimple size={14} />
            Скачать файл
          </Button>
        )}
      </div>
    </div>
  );
}

interface ChangeListProps {
  version: DrawingVersion;
  side: "left" | "right";
}

function ChangeList({ version, side }: ChangeListProps) {
  const changes = version.changes ?? [];
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-text-secondary mb-2">{version.version}</p>
      {changes.length === 0 ? (
        <p className="text-xs text-text-tertiary italic">Нет описания изменений</p>
      ) : (
        <ul className="space-y-1">
          {changes.map((c, i) => (
            <li key={i} className={cn(
              "flex items-start gap-2 text-xs",
              side === "right" ? "text-emerald-700" : "text-text-secondary"
            )}>
              <span className="mt-0.5 shrink-0">
                {side === "right" ? <Check size={11} weight="bold" /> : <ArrowLeft size={11} />}
              </span>
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
