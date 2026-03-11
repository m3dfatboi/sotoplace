"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRole } from "@/contexts/role-context";
import { DEALS, formatMoney, formatMoneyShort } from "@/lib/mock-data";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusTimeline, type TimelineStep } from "@/components/ui/status-timeline";
import {
  Package, Truck, CurrencyCircleDollar, ClockCounterClockwise,
  ArrowRight, ChatCircle, FileText, ShoppingCart, DownloadSimple,
} from "@phosphor-icons/react";

// Клиент видит только сделки ООО «ОфисПлюс»
const clientDeals = DEALS.filter((d) => d.client === "ООО «ОфисПлюс»");

const statusToTimeline: Record<string, TimelineStep[]> = {
  in_production: [
    { label: "Принят",        status: "completed" },
    { label: "КП согласовано", status: "completed" },
    { label: "Производство",  status: "current"   },
    { label: "Отгрузка",      status: "upcoming"  },
    { label: "Доставлено",    status: "upcoming"  },
  ],
  ready: [
    { label: "Принят",       status: "completed" },
    { label: "Производство", status: "completed" },
    { label: "Готово",       status: "completed" },
    { label: "Отгрузка",     status: "current"   },
    { label: "Доставлено",   status: "upcoming"  },
  ],
  shipped: [
    { label: "Принят",       status: "completed" },
    { label: "Производство", status: "completed" },
    { label: "Отгружено",    status: "completed" },
    { label: "В пути",       status: "current"   },
    { label: "Доставлено",   status: "upcoming"  },
  ],
};

const historyDeals = [
  { id: "2831", num: "#2831", name: "Кресла офисные (10 шт.)",   total: 89000,  date: "15 фев 2026" },
  { id: "2820", num: "#2820", name: "Столы руководителя (3 шт.)", total: 120000, date: "2 фев 2026" },
  { id: "2805", num: "#2805", name: "Тумбы подкатные (20 шт.)",  total: 56500,  date: "18 янв 2026" },
];

const totalSpent = clientDeals.reduce((s, d) => s + d.saleAmount, 0)
  + historyDeals.reduce((s, d) => s + d.total, 0);

export default function ClientDashboardPage() {
  const router = useRouter();
  const { user } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Мои заказы</h1>
          <p className="text-sm text-text-secondary mt-0.5">{user.company}</p>
        </div>
        <Link href="/catalog"><Button><ShoppingCart size={16} />Новый заказ</Button></Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Активных заказов"   value={String(clientDeals.length)}         subtitle="в обработке"         icon={<Package size={20} />} />
        <KpiCard title="Сумма заказов"      value={formatMoneyShort(totalSpent)}        subtitle="за всё время"        icon={<CurrencyCircleDollar size={20} />} />
        <KpiCard title="Ожидается отгрузок" value={String(clientDeals.filter((d) => d.status === "ready").length)} subtitle="готово к отгрузке" icon={<Truck size={20} />} />
        <KpiCard title="Всего заказов"      value={String(clientDeals.length + historyDeals.length)} subtitle="за всё время" icon={<ClockCounterClockwise size={20} />} />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-text-primary">Текущие заказы</h2>
        {clientDeals.map((deal) => {
          const timeline = statusToTimeline[deal.status] ?? statusToTimeline.in_production;
          const readyPct = deal.status === "ready" || deal.status === "shipped" ? 100
            : deal.status === "in_production" ? 60 : 30;
          return (
            <Card key={deal.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-text-primary">
                        {deal.positions.map((p) => p.name).join(", ").slice(0, 50)}
                        {deal.positions.length > 2 ? "..." : ""}
                      </span>
                      <span className="text-sm font-mono text-text-tertiary">{deal.num}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Сумма: <span className="font-medium text-text-primary">{formatMoney(deal.saleAmount)}</span>
                      {deal.slaDeadline !== "—" && (
                        <> · Ожидается: <span className="font-medium">{deal.slaDeadline}</span></>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={deal.statusVariant}>{deal.statusLabel}</Badge>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/deals/${deal.id}/client-view`)}>
                      Подробнее <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Progress value={readyPct} color={readyPct >= 90 ? "success" : "primary"} className="flex-1" />
                  <span className="text-xs font-medium text-text-secondary shrink-0">{readyPct}%</span>
                </div>
                <StatusTimeline steps={timeline} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>История заказов</CardTitle>
            <Button variant="ghost" size="sm">Все <ArrowRight size={13} /></Button>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="divide-y divide-border">
              {historyDeals.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{o.name}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{o.num} · {o.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-text-primary">{formatMoney(o.total)}</span>
                    <Button variant="ghost" size="sm"><DownloadSimple size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Быстрые действия</CardTitle></CardHeader>
          <CardContent className="pb-4 space-y-2">
            {[
              { icon: <ShoppingCart size={18} />, label: "Перейти в каталог",  desc: "Оформить новый заказ",    href: "/catalog" },
              { icon: <ChatCircle size={18} />,   label: "Написать менеджеру", desc: "Задать вопрос по заказу", href: "/messages" },
              { icon: <FileText size={18} />,     label: "Документы",          desc: "Счета, акты, договоры",   href: "/settings" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border px-4 py-3 hover:bg-subtle hover:border-border-strong transition-colors cursor-pointer">
                  <span className="text-primary">{action.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{action.label}</p>
                    <p className="text-xs text-text-tertiary">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-text-tertiary" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
