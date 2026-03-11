"use client";

import { useState } from "react";
import { Plus, X, FunnelSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Select } from "./select";
import { Button } from "./button";

export interface FilterField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  options?: { value: string; label: string }[];
}

export type FilterOperator =
  | "contains" | "not_contains"
  | "equals" | "not_equals"
  | "gt" | "lt" | "gte" | "lte"
  | "in" | "not_in"
  | "before" | "after";

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

const TEXT_OPS: { value: FilterOperator; label: string }[] = [
  { value: "contains",     label: "содержит" },
  { value: "not_contains", label: "не содержит" },
  { value: "equals",       label: "равно" },
  { value: "not_equals",   label: "не равно" },
];

const NUMBER_OPS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "=" },
  { value: "gt",     label: ">" },
  { value: "lt",     label: "<" },
  { value: "gte",    label: "≥" },
  { value: "lte",    label: "≤" },
];

const SELECT_OPS: { value: FilterOperator; label: string }[] = [
  { value: "in",     label: "одно из" },
  { value: "not_in", label: "не из" },
  { value: "equals", label: "равно" },
];

const DATE_OPS: { value: FilterOperator; label: string }[] = [
  { value: "before", label: "до" },
  { value: "after",  label: "после" },
  { value: "equals", label: "равно" },
];

function getOpsForType(type: FilterField["type"]) {
  if (type === "number") return NUMBER_OPS;
  if (type === "select") return SELECT_OPS;
  if (type === "date")   return DATE_OPS;
  return TEXT_OPS;
}

function uid() { return Math.random().toString(36).slice(2); }

interface FilterBuilderProps {
  fields: FilterField[];
  value: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
  className?: string;
}

export function FilterBuilder({ fields, value, onChange, className }: FilterBuilderProps) {
  const addRule = () => {
    const firstField = fields[0];
    if (!firstField) return;
    const ops = getOpsForType(firstField.type);
    onChange([...value, { id: uid(), field: firstField.key, operator: ops[0].value, value: "" }]);
  };

  const removeRule = (id: string) => onChange(value.filter((r) => r.id !== id));

  const updateRule = (id: string, patch: Partial<FilterRule>) =>
    onChange(value.map((r) => r.id === id ? { ...r, ...patch } : r));

  return (
    <div className={cn("space-y-2", className)}>
      {value.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-text-tertiary py-2">
          <FunnelSimple size={16} />
          Фильтры не применены
        </div>
      )}

      {value.map((rule, i) => {
        const field = fields.find((f) => f.key === rule.field);
        const ops = field ? getOpsForType(field.type) : TEXT_OPS;

        return (
          <div key={rule.id} className="flex items-center gap-2 flex-wrap">
            {/* Conjunction label */}
            <span className="w-8 text-xs font-medium text-text-tertiary text-right shrink-0">
              {i === 0 ? "Где" : "И"}
            </span>

            {/* Field */}
            <Select
              className="w-40"
              options={fields.map((f) => ({ value: f.key, label: f.label }))}
              value={rule.field}
              onChange={(v) => {
                const newField = fields.find((f) => f.key === v);
                const newOps = newField ? getOpsForType(newField.type) : TEXT_OPS;
                updateRule(rule.id, { field: v, operator: newOps[0].value, value: "" });
              }}
            />

            {/* Operator */}
            <Select
              className="w-36"
              options={ops}
              value={rule.operator}
              onChange={(v) => updateRule(rule.id, { operator: v as FilterOperator })}
            />

            {/* Value */}
            {field?.type === "select" ? (
              <Select
                className="w-44"
                options={field.options ?? []}
                value={rule.value}
                onChange={(v) => updateRule(rule.id, { value: v })}
                placeholder="Значение..."
              />
            ) : (
              <input
                type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                value={rule.value}
                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                placeholder="Значение..."
                className={cn(
                  "h-9 w-44 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm",
                  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "placeholder:text-text-tertiary"
                )}
              />
            )}

            {/* Remove */}
            <button
              onClick={() => removeRule(rule.id)}
              className="rounded-[var(--radius-md)] p-1.5 text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <Button variant="ghost" size="sm" onClick={addRule} className="mt-1">
        <Plus size={14} />
        Добавить условие
      </Button>
    </div>
  );
}

// Active filter chips (для отображения применённых фильтров)
interface ActiveFiltersProps {
  fields: FilterField[];
  rules: FilterRule[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ fields, rules, onRemove, onClearAll }: ActiveFiltersProps) {
  if (rules.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-tertiary">Фильтры:</span>
      {rules.map((rule) => {
        const field = fields.find((f) => f.key === rule.field);
        return (
          <span
            key={rule.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-light px-2.5 py-0.5 text-xs text-primary"
          >
            {field?.label ?? rule.field}: {rule.value}
            <button onClick={() => onRemove(rule.id)} className="hover:text-primary/60">
              <X size={10} />
            </button>
          </span>
        );
      })}
      <button onClick={onClearAll} className="text-xs text-text-tertiary hover:text-danger transition-colors">
        Сбросить всё
      </button>
    </div>
  );
}
