"use client";

import {
  Users,
  Buildings,
  CurrencyCircleDollar,
  Warning,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Gear,
  ShieldCheck,
  Database,
  Activity,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

// ─── Data ─────────────────────────────────────────────────────────────────────

const kpis = [
  { title: "Всего тенантов",    value: "24",      subtitle: "активных компаний",   icon: <Buildings size={20} />, change: { value: "3", positive: true } },
  { title: "Пользователи",      value: "187",     subtitle: "зарегистрировано",    icon: <Users size={20} />, change: { value: "12%", positive: true } },
  { title: "Выручка платформы", value: "2.4M ₽",  subtitle: "за этот месяц",      icon: <CurrencyCircleDollar size={20} />, change: { value: "8%", positive: true } },
  { title: "Системные ошибки",  value: "2",       subtitle: "требуют внимания",   icon: <Warning size={20} />, alert: true },
];

const tenants = [
  { id: 1, name: "ООО «МебельОпт»",   plan: "Pro",      users: 12, mrr: "48 000 ₽",  status: "active",    lastActivity: "Только что" },
  { id: 2, name: "СтройМаг",          plan: "Business", users: 8,  mrr: "32 000 ₽",  status: "active",    lastActivity: "2ч назад" },
  { id: 3, name: "ООО «ОфисПлюс»",   plan: "Starter",  users: 3,  mrr: "12 000 ₽",  status: "active",    lastActivity: "1д назад" },
  { id: 4, name: "Домострой",         plan: "Pro",      users: 19, mrr: "48 000 ₽",  status: "active",    lastActivity: "3ч назад" },
  { id: 5, name: "ИП Краснов А.С.",   plan: "Starter",  users: 2,  mrr: "12 000 ₽",  status: "trial",     lastActivity: "5д назад" },
  { id: 6, name: "МеталлПро",         plan: "Business", users: 6,  mrr: "0 ₽",       status: "suspended", lastActivity: "7д назад" },
];

const systemEvents = [
  { id: 1, type: "error",   text: "Ошибка подключения к S3 (tenant: metallopro)",    time: "30 мин назад" },
  { id: 2, type: "warning", text: "Высокая нагрузка БД — 87% CPU пиковая",           time: "1ч назад" },
  { id: 3, type: "info",    text: "Выполнено автоматическое резервное копирование",  time: "2ч назад" },
  { id: 4, type: "success", text: "Деплой v1.4.2 успешно завершён",                  time: "5ч назад" },
  { id: 5, type: "info",    text: "Новый тенант: ООО «ТехноМебель» зарегистрирован", time: "Вчера" },
];

const planStats = [
  { plan: "Starter",  count: 10, pct: 42, color: "default"  as const },
  { plan: "Pro",      count: 9,  pct: 37, color: "primary"  as const },
  { plan: "Business", count: 5,  pct: 21, color: "success"  as const },
];

const tenantStatusMeta = {
  active:    { label: "Активен",    variant: "success"   as const },
  trial:     { label: "Триал",      variant: "warning"   as const },
  suspended: { label: "Заморожен",  variant: "danger"    as const },
};

const eventMeta = {
  error:   { color: "text-danger",        dot: "bg-danger" },
  warning: { color: "text-amber-600",     dot: "bg-amber-400" },
  info:    { color: "text-text-secondary",dot: "bg-text-tertiary" },
  success: { color: "text-emerald-700",   dot: "bg-emerald-500" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Панель администратора</h1>
          <p className="text-sm text-text-secondary mt-0.5">Обзор платформы · 11 марта 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Database size={15} />Резервная копия</Button>
          <Button variant="outline" size="sm"><Gear size={15} />Настройки</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.title} {...k} />
        ))}
      </div>

      {/* System health */}
      <Card>
        <CardHeader>
          <CardTitle>Состояние системы</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "API",         pct: 99.8, status: "ok"  },
              { label: "База данных", pct: 92,   status: "ok"  },
              { label: "Файловое хранилище", pct: 0, status: "error" },
              { label: "Очередь задач", pct: 100, status: "ok" },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">{item.label}</span>
                  {item.status === "ok"
                    ? <Badge variant="success" size="sm">OK</Badge>
                    : <Badge variant="danger" size="sm">Ошибка</Badge>
                  }
                </div>
                <Progress
                  value={item.pct}
                  color={item.pct >= 99 ? "success" : item.pct >= 80 ? "warning" : "danger"}
                  size="sm"
                />
                <p className="text-[11px] text-text-tertiary">{item.pct}% uptime</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenants table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Тенанты</CardTitle>
              <Button variant="ghost" size="sm">Все <ArrowRight size={13} /></Button>
            </CardHeader>
            <CardContent className="pb-0 px-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide">Компания</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide">Тариф</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium text-text-tertiary uppercase tracking-wide">Польз.</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-text-tertiary uppercase tracking-wide">MRR</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide">Статус</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide">Активность</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tenants.map((t) => {
                      const sm = tenantStatusMeta[t.status as keyof typeof tenantStatusMeta];
                      return (
                        <tr key={t.id} className="hover:bg-subtle transition-colors cursor-pointer">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar initials={t.name.slice(0, 2).toUpperCase()} size="sm" />
                              <span className="font-medium text-text-primary">{t.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge size="sm" variant={t.plan === "Business" ? "primary" : t.plan === "Pro" ? "secondary" : "default"}>
                              {t.plan}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-text-secondary">{t.users}</td>
                          <td className="px-4 py-3 text-right font-medium text-text-primary">{t.mrr}</td>
                          <td className="px-4 py-3"><Badge variant={sm.variant} size="sm">{sm.label}</Badge></td>
                          <td className="px-4 py-3 text-xs text-text-tertiary">{t.lastActivity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Plan distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение тарифов</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              {planStats.map((p) => (
                <div key={p.plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{p.plan}</span>
                    <span className="font-medium text-text-primary">{p.count} ({p.pct}%)</span>
                  </div>
                  <Progress value={p.pct} color={p.color} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System log */}
          <Card>
            <CardHeader>
              <CardTitle>Системный журнал</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              {systemEvents.map((e) => {
                const em = eventMeta[e.type as keyof typeof eventMeta];
                return (
                  <div key={e.id} className="flex gap-3 items-start">
                    <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${em.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${em.color}`}>{e.text}</p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">{e.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
