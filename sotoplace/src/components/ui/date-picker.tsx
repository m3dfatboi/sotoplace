"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarBlank, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS_RU = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday-first weekday (0=Mon...6=Sun)
function weekday(date: Date) {
  return (date.getDay() + 6) % 7;
}

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({ value, onChange, label, placeholder = "Выбрать дату", error, disabled, minDate, maxDate, className }: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState((value ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((value ?? today).getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const first = startOfMonth(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const offset = weekday(first); // how many empty cells before day 1

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    const d = new Date(viewYear, viewMonth, day);
    onChange?.(d);
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      {label && <label className="mb-1.5 block text-[13px] font-medium text-text-primary">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-[var(--radius-md)] border bg-surface px-3 text-sm transition-colors",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:bg-subtle disabled:text-text-tertiary disabled:cursor-not-allowed",
          error ? "border-danger" : "border-border hover:border-border-strong",
          open && "border-primary ring-2 ring-primary/20"
        )}
      >
        <span className={cn("flex items-center gap-2", !value && "text-text-tertiary")}>
          <CalendarBlank size={15} className="shrink-0 text-text-tertiary" />
          {value ? formatDate(value) : placeholder}
        </span>
        {value && (
          <button onClick={clear} className="ml-1 rounded p-0.5 hover:text-text-primary text-text-tertiary transition-colors">
            <X size={13} />
          </button>
        )}
      </button>

      {open && (
        <div className="absolute z-30 mt-1 rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl p-3 min-w-[280px] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="rounded-[var(--radius-md)] p-1 hover:bg-subtle transition-colors text-text-secondary">
              <CaretLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-text-primary">
              {MONTHS_RU[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="rounded-[var(--radius-md)] p-1 hover:bg-subtle transition-colors text-text-secondary">
              <CaretRight size={15} />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_RU.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-text-tertiary py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(viewYear, viewMonth, day);
              const isToday = isSameDay(date, today);
              const isSelected = value ? isSameDay(date, value) : false;
              const disabled = isDisabled(day);
              return (
                <button
                  key={day}
                  onClick={() => handleSelect(day)}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-full rounded-[var(--radius-md)] text-sm transition-colors",
                    disabled && "opacity-30 cursor-not-allowed",
                    !disabled && !isSelected && "hover:bg-subtle text-text-primary",
                    isToday && !isSelected && "font-semibold text-primary",
                    isSelected && "bg-primary text-white font-medium"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-2 pt-2 border-t border-border text-center">
            <button
              onClick={() => { onChange?.(today); setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setOpen(false); }}
              className="text-xs text-primary hover:underline"
            >
              Сегодня
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

// Date range picker
interface DateRangePickerProps {
  from?: Date | null;
  to?: Date | null;
  onChange?: (range: { from: Date | null; to: Date | null }) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({ from, to, onChange, label, disabled, className }: DateRangePickerProps) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      <DatePicker
        label={label ? `${label} от` : "От"}
        value={from}
        onChange={(d) => onChange?.({ from: d, to: to ?? null })}
        maxDate={to ?? undefined}
        disabled={disabled}
      />
      <DatePicker
        label={label ? `${label} до` : "До"}
        value={to}
        onChange={(d) => onChange?.({ from: from ?? null, to: d })}
        minDate={from ?? undefined}
        disabled={disabled}
      />
    </div>
  );
}
