"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ENGINEERING_TASKS, type TaskStatus, type TaskPriority } from "@/lib/mock-data";
import {
  Plus, MagnifyingGlass, Clock, Warning, CheckCircle,
  FileArrowUp, ChatCircle,
} from "@phosphor-icons/react";

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: "new",         label: "Новые",       color: "text-text-secondary" },
  { key: "in_progress", label: "В работе",    color: "text-primary" },
  { key: "review",      label: "На проверке", color: "text-[var(--color-secondary-600)]" },
  { key: "approved",    label: "Согласовано", color: "text-success" },
];

const priorityBadge: Record<TaskPriority, { label: string; variant: "danger" | "warning" | "default" }> = {
  high:   { label: "Срочно",  variant: "danger"  },
  medium: { label: "Средний", variant: "warning" },
  low:    { label: "Низкий",  variant: "default" },
};

const tabs = [
  { label: "Мои задачи",     count: ENGINEERING_TASKS.filter((t) => t.status !== "approved").length },
  { label: "Все чертежи",    count: ENGINEERING_TASKS.length },
  { label: "На согласовании", count: ENGINEERING_TASKS.filter((t) => t.status === "review").length },
];

export default function EngineeringPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const filtered = ENGINEERING_TASKS.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.dealNum.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Инжиниринг</h1>
        <Button size="md"><Plus size={16} weight="bold" className="mr-1.5" />Новая задача</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === i ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${activeTab === i ? "bg-primary/10 text-primary" : "bg-subtle text-text-tertiary"}`}>
              {tab.count}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-2">
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск задач..."
              className="h-8 w-48 rounded-[var(--radius-md)] border border-border bg-surface pl-8 pr-3 text-[13px] placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-subtle text-[11px] font-medium text-text-tertiary px-1.5">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {colTasks.map((task) => (
                  <Card
                    key={task.id}
                    hover
                    padding="sm"
                    className="space-y-2 cursor-pointer"
                    onClick={() => router.push(`/engineering/${task.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={priorityBadge[task.priority].variant}>
                        {priorityBadge[task.priority].label}
                      </Badge>
                      <span className="text-[11px] text-text-tertiary font-mono">{task.id}</span>
                    </div>

                    <h4 className="text-sm font-medium text-text-primary leading-snug">{task.title}</h4>

                    <p className="text-xs text-text-tertiary">
                      Сделка{" "}
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/deals/${task.dealId}`); }}
                        className="text-primary hover:underline"
                      >
                        {task.dealNum}
                      </button>
                      {" "}· {task.position}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      {task.deadlineUrgent ? <Warning size={12} className="text-danger" /> : <Clock size={12} />}
                      <span className={task.deadlineUrgent ? "text-danger font-medium" : ""}>{task.deadline}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border mt-1">
                      <span className="text-[11px] text-text-tertiary">{task.version}</span>
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
                          <ChatCircle size={12} />{task.comments}
                        </div>
                      )}
                    </div>

                    {task.status === "new" && (
                      <Button variant="outline" size="sm" className="w-full mt-1" onClick={(e) => { e.stopPropagation(); router.push(`/engineering/${task.id}`); }}>
                        <FileArrowUp size={14} className="mr-1" />Начать
                      </Button>
                    )}
                  </Card>
                ))}

                {colTasks.length === 0 && (
                  <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-border py-8 text-center">
                    <p className="text-sm text-text-tertiary">Нет задач</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
