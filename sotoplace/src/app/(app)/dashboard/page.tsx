"use client";

import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/role-context";
import { DEALS, getDashboardStats, getFunnelData, ENGINEERING_TASKS, formatMoney, formatMoneyShort } from "@/lib/mock-data";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Receipt, CurrencyCircleDollar, CheckCircle, Warning,
  ArrowRight, Circle, CheckSquare,
} from "@phosphor-icons/react";
import { useState } from "react";

const stats = getDashboardStats();
const funnelData = getFunnelData();
const funnelMax = Math.max(...funnelData.map((f) => f.value), 1);

const TASKS = [
  { id: 1, text: `Согласовать КП по сделке #2847 с ООО «ОфисПлюс»`, done: false },
  { id: 2, text: `Найти подрядчика на лазерную резку (#2843 — просрочено!)`, done: false },
  { id: 3, text: `Подтвердить оплату от СтройМаг по сделке #2846`, done: false },
  { id: 4, text: `Отправить чертежи #2843 конструктору Марии`, done: true },
];

const ALERTS = [
  { text: "Сделка #2843 (МебельОпт) — SLA просрочен на 2 дня", variant: "danger"  as const, dealId: "2843" },
  { text: "Оплата по сделке #2846 (СтройМаг) — ждём перевод", variant: "warning" as const, dealId: "2846" },
  { text: "Новый заказ от ООО «Техно» #2842 — нужно КП",      variant: "primary" as const, dealId: "2842" },
];

const statusVariants: Record<string, "primary" | "warning" | "success" | "danger" | "default" | "secondary"> = {
  in_production: "primary",
  approved:      "warning",
  ready:         "success",
  draft:         "default",
  cancelled:     "danger",
};

export default function DashboardPage() {
  const { user } = useRole();
  const router = useRouter();
  const [tasks, setTasks] = useState(TASKS);

  const recentDeals = DEALS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Добрый день, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {user.company} · {DEALS.length} активных сделок на {formatMoneyShort(stats.totalRevenue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Квартал</Button>
          <Button variant="ghost" size="sm">Месяц</Button>
          <Button variant="ghost" size="sm">Неделя</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Активные сделки"
          value={String(stats.activeCount)}
          subtitle={`из ${DEALS.length} всего`}
          icon={<Receipt size={20} />}
          change={{ value: "2 новых", positive: true }}
        />
        <KpiCard
          title="Выручка"
          value={formatMoneyShort(stats.totalRevenue)}
          subtitle="сумма всех сделок"
          icon={<CurrencyCircleDollar size={20} />}
        />
        <KpiCard
          title="Оплачено"
          value={formatMoneyShort(stats.paid)}
          subtitle={`${stats.paidPct}% от общей суммы`}
          icon={<CheckCircle size={20} />}
          change={{ value: `${stats.paidPct}%`, positive: true }}
        />
        <KpiCard
          title="Просрочено SLA"
          value={String(stats.overdueCount)}
          subtitle="требуют внимания"
          icon={<Warning size={20} />}
          alert={stats.overdueCount > 0}
        />
      </div>

      {/* Funnel + Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Воронка продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((step) => (
                <div key={step.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">{step.label}</span>
                    <span className="font-semibold tabular-nums">{step.value}</span>
                  </div>
                  <Progress value={step.value === 0 ? 0 : Math.max(8, Math.round((step.value / funnelMax) * 100))} variant="default" size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent deals */}
        <Card padding="none" className="lg:col-span-3">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h3 className="text-base font-semibold">Последние сделки</h3>
            <Button variant="ghost" size="sm" onClick={() => router.push("/deals")}>
              Все сделки <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[13px] text-text-secondary">
                  <th className="px-4 py-2 font-medium">№</th>
                  <th className="px-4 py-2 font-medium">Контрагент</th>
                  <th className="px-4 py-2 font-medium text-right">Сумма</th>
                  <th className="px-4 py-2 font-medium">Статус</th>
                  <th className="px-4 py-2 font-medium text-right">SLA</th>
                </tr>
              </thead>
              <tbody>
                {recentDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => router.push(`/deals/${deal.id}`)}
                    className="border-b border-border last:border-0 hover:bg-subtle/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5 font-medium font-mono text-[13px] text-primary">{deal.num}</td>
                    <td className="px-4 py-2.5">{deal.client}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatMoney(deal.saleAmount)}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={deal.statusVariant} dot>{deal.statusLabel}</Badge>
                    </td>
                    <td className={`px-4 py-2.5 text-right text-[13px] font-medium ${deal.slaOk ? "text-text-secondary" : "text-danger"}`}>
                      {deal.slaRemaining}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Tasks + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Задачи на сегодня</CardTitle>
            <Badge variant="primary">{tasks.filter((t) => !t.done).length} активных</Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, done: !t.done } : t))}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] px-2 py-2 hover:bg-subtle/50 transition-colors cursor-pointer"
                >
                  <span className="mt-0.5 text-text-tertiary shrink-0">
                    {task.done
                      ? <CheckSquare size={18} weight="fill" className="text-success" />
                      : <Circle size={18} />}
                  </span>
                  <span className={task.done ? "text-text-tertiary line-through" : "text-text-primary"}>
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <Badge variant="danger">{ALERTS.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ALERTS.map((alert, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/deals/${alert.dealId}`)}
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm cursor-pointer transition-opacity hover:opacity-80 ${
                    alert.variant === "danger"  ? "bg-danger-light text-[var(--color-danger-700)]"  :
                    alert.variant === "warning" ? "bg-warning-light text-[var(--color-warning-700)]" :
                    "bg-primary-light text-[var(--color-primary-700)]"
                  }`}
                >
                  <Warning size={16} weight="fill" className="shrink-0" />
                  <span className="flex-1">{alert.text}</span>
                  <ArrowRight size={14} className="shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
