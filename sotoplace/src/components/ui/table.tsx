"use client";

import { useState, type ReactNode } from "react";
import { ArrowUp, ArrowDown, ArrowsDownUp } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  hidden?: boolean;
}

type Density = "compact" | "default" | "comfortable";

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  density?: Density;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  stickyHeader?: boolean;
  className?: string;
  footer?: ReactNode;
}

const densityRows: Record<Density, string> = {
  compact:     "py-1.5",
  default:     "py-3",
  comfortable: "py-4",
};

export function Table<T>({
  columns,
  data,
  keyExtractor,
  density = "default",
  onRowClick,
  emptyMessage = "Нет данных",
  loading,
  stickyHeader,
  className,
  footer,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const visibleCols = columns.filter((c) => !c.hidden);

  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-border", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={cn("bg-subtle text-text-secondary", stickyHeader && "sticky top-0 z-10")}>
            <tr>
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide whitespace-nowrap border-b border-border",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.sortable && "cursor-pointer select-none hover:text-text-primary transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === "asc"
                          ? <ArrowUp size={12} weight="bold" />
                          : <ArrowDown size={12} weight="bold" />
                        : <ArrowsDownUp size={12} className="opacity-40" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {visibleCols.map((col) => (
                    <td key={col.key} className={cn("px-4", densityRows[density])}>
                      <div className="h-4 rounded bg-subtle animate-pulse" style={{ width: "60%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length} className="px-4 py-12 text-center text-text-tertiary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={keyExtractor(row, i)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-subtle"
                  )}
                >
                  {visibleCols.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 text-text-primary",
                        densityRows[density],
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right"
                      )}
                    >
                      {col.cell(row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="border-t border-border px-4 py-3 bg-subtle text-sm text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
}

// Density toggle helper
interface DensityToggleProps {
  value: Density;
  onChange: (d: Density) => void;
}

export function DensityToggle({ value, onChange }: DensityToggleProps) {
  const options: { key: Density; label: string }[] = [
    { key: "compact", label: "S" },
    { key: "default", label: "M" },
    { key: "comfortable", label: "L" },
  ];
  return (
    <div className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface overflow-hidden">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "px-2.5 py-1.5 text-xs font-medium transition-colors",
            value === o.key
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-subtle"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
