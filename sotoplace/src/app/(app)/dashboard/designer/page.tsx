"use client";

import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/role-context";
import { ENGINEERING_TASKS, DEALS, formatMoney } from "@/lib/mock-data";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { PencilRuler, CheckCircle, Clock, Warning, ArrowRight, FilePlus } from "@phosphor-icons/react";

const statusMeta = {
  new:         { label: "Ожидает",     variant: "default"  as const },
  in_progress: { label: "В работе",   variant: "primary"  as const },
  review:      { label: "На проверке", variant: "warning"  as const },
  approved:    { label: "Согласован",  variant: "success"  as const },
};

const priorityMeta = {
  high:   { color: "text-danger" },
  medium: { color: "text-amber-600" },
  low:    { color: "text-text-tertiary" },
};

const recentComments = [
  { id: 1, author: "Иван Смирнов",  role: "Менеджер",  initials: "ИС", text: `По задаче T-001 (#2847) — нужен чертёж каркаса до сегодняшнего вечера`, drawing: "T-001", time: "1ч назад" },
  { id: 2, author: "Алексей Козлов", role: "Технолог", initials: "АК", text: `Толщина металла в T-004 должна быть 3мм по ГОСТ, исправьте`, drawing: "T-004", time: "3ч назад" },
  { id: 3, author: "Иван Смирнов",  role: "Менеджер",  initials: "ИС", text: `T-005 и T-006 согласованы, можно передавать в производство`, drawing: "T-005/006", time: "Вчера" },
];

export default function ConstructorDashboardPage() {
  const router = useRouter();
  const { user } = useRole();

  const myTasks = ENGINEERING_TASKS;
  const inWork  = myTasks.filter((t) => t.status === "in_progress").length;
  const onReview = myTasks.filter((t) => t.status === "review").length;
  const approved = myTasks.filter((t) => t.status === "approved").length;
  const overdue  = myTasks.filter((t) => t.deadlineUrgent && t.status !== "approved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Рабочий стол</h1>
          <p className="text-sm text-text-secondary mt-0.5">{user.name} · {myTasks.length} задач</p>
        </div>
        <Button><FilePlus size={16} />Новый чертёж</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="В работе"      value={String(inWork)}   subtitle="чертежей" icon={<PencilRuler size={20} />} />
        <KpiCard title="На проверке"   value={String(onReview)} subtitle="ожидают ответа" icon={<Clock size={20} />} />
        <KpiCard title="Согласовано"   value={String(approved)} subtitle="выполнено" icon={<CheckCircle size={20} />} />
        <KpiCard title="Просрочено"    value={String(overdue)}  subtitle="срочно!" icon={<Warning size={20} />} alert={overdue > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Мои задачи</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/engineering")}>
                Все задачи <ArrowRight size={14} />
              </Button>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="divide-y divide-border">
                {myTasks.map((task) => {
                  const sm = statusMeta[task.status];
                  const pm = priorityMeta[task.priority];
                  return (
                    <div
                      key={task.id}
                      onClick={() => router.push(`/engineering/${task.id}`)}
                      className="flex items-center gap-4 py-3 hover:bg-subtle/50 -mx-2 px-2 rounded-[var(--radius-md)] transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-mono text-text-tertiary">{task.id}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/deals/${task.dealId}`); }}
                            className="text-[11px] text-primary hover:underline"
                          >
                            → {task.dealNum}
                          </button>
                        </div>
                        <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                        <span className={`text-[11px] font-medium ${pm.color}`}>{task.position}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge variant={sm.variant} size="sm">{sm.label}</Badge>
                        <span className={`text-xs ${task.deadlineUrgent ? "text-danger font-medium" : "text-text-tertiary"}`}>
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Загрузка</CardTitle></CardHeader>
            <CardContent className="pb-4 space-y-3 text-sm">
              {[
                { label: "В работе",    value: inWork,   max: myTasks.length, color: "primary" as const },
                { label: "На проверке", value: onReview, max: myTasks.length, color: "warning" as const },
                { label: "Согласовано", value: approved, max: myTasks.length, color: "success" as const },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="font-medium text-text-primary">{item.value}/{myTasks.length}</span>
                  </div>
                  <Progress value={myTasks.length ? (item.value / myTasks.length) * 100 : 0} color={item.color} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Последние комментарии</CardTitle></CardHeader>
            <CardContent className="pb-4 space-y-3">
              {recentComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.author} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-xs font-semibold text-text-primary">{c.author}</span>
                      <span className="text-[10px] text-text-tertiary shrink-0">{c.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{c.text}</p>
                    <span className="text-[10px] font-mono text-primary mt-0.5 inline-block">{c.drawing}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
