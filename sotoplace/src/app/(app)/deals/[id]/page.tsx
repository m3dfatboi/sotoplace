"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { StatusTimeline, type TimelineStep } from "@/components/ui/status-timeline";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { getDeal, getDealCostTotal, getDealMargin, getDealMarginPct, formatMoney, type DealStatus } from "@/lib/mock-data";
import {
  ArrowLeft, Printer, DotsThree, CheckCircle, Circle, Spinner,
  ChatCircle, FileText, Truck, CurrencyCircleDollar, ClockCounterClockwise,
  Plus, ArrowSquareOut, Eye,
} from "@phosphor-icons/react";
import { useState } from "react";

const statusToTimeline: Record<DealStatus, number> = {
  draft: 0, proposal_sent: 1, approved: 2, in_production: 3, ready: 4, shipped: 5, closed: 6, cancelled: 0,
};

function buildTimeline(status: DealStatus): TimelineStep[] {
  const steps = ["Черновик", "КП отправлено", "Согласовано", "Производство", "Готово к отгрузке", "Закрыто"];
  const current = statusToTimeline[status];
  return steps.map((label, i) => ({
    label,
    status: i < current ? "completed" : i === current ? "current" : "upcoming",
  }));
}

const TABS = [
  { id: "positions", label: "Позиции" },
  { id: "documents", label: "Документы", count: 3 },
  { id: "payments",  label: "Оплаты" },
  { id: "logistics", label: "Логистика" },
  { id: "chat",      label: "Чат", count: 5 },
  { id: "history",   label: "История" },
];

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deal = getDeal(id);
  const [activeTab, setActiveTab] = useState("positions");

  if (!deal) {
    return (
      <EmptyState
        title="Сделка не найдена"
        description={`Сделка #${id} не существует`}
        action={{ label: "Все сделки", onClick: () => router.push("/deals") }}
      />
    );
  }

  const costTotal = getDealCostTotal(deal);
  const margin = getDealMargin(deal);
  const marginPct = getDealMarginPct(deal);
  const timeline = buildTimeline(deal.status);

  const presenceUsers = [
    { name: deal.managerName, online: true },
    { name: "Алексей Козлов", online: true },
    { name: "Мария Петрова",  online: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/deals">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-1" />
              Сделки
            </Button>
          </Link>
          <span className="text-text-tertiary">/</span>
          <span className="text-sm font-medium">{deal.num}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-[-0.01em]">Сделка {deal.num}</h1>
              <Badge variant={deal.statusVariant} dot>{deal.statusLabel}</Badge>
            </div>
            <p className="text-sm text-text-secondary mt-0.5">
              {deal.client} · Создана {deal.date} 2026 · Менеджер: {deal.managerName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AvatarStack users={presenceUsers} max={3} size="sm" />
              <span className="text-xs text-text-tertiary hidden sm:inline">Сейчас в сделке</span>
            </div>
            <div className="h-5 w-px bg-border" />
            <Link href={`/deals/${id}/client-view`}>
              <Button variant="outline" size="sm"><Eye size={14} className="mr-1.5" />Вид клиента</Button>
            </Link>
            <Button variant="outline" size="sm"><Printer size={14} className="mr-1.5" />Печать</Button>
            <Button variant="ghost" size="icon"><DotsThree size={18} weight="bold" /></Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <StatusTimeline steps={timeline} />
        {deal.slaDeadline !== "—" && (
          <p className="text-xs text-text-secondary mt-3 text-center">
            SLA: {deal.slaDeadline} · Осталось: <span className={deal.slaOk ? "text-text-primary font-medium" : "text-danger font-medium"}>{deal.slaRemaining}</span>
          </p>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className="rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[11px]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Positions tab */}
      {activeTab === "positions" && (
        <div className="space-y-4">
          {deal.positions.map((pos, idx) => (
            <Card key={pos.id} padding="none">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-text-secondary">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold">{pos.name} × {pos.qty} шт</h4>
                </div>
                <span className="text-sm font-semibold font-mono tabular-nums">{formatMoney(pos.costTotal)}</span>
              </div>

              {pos.parts.length > 0 ? (
                <div className="divide-y divide-border">
                  {pos.parts.map((part) => (
                    <div key={part.id} className="px-4 py-3 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-text-tertiary">├──</span>
                          <span className="text-sm font-medium">{part.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[13px]">
                          <span className="text-text-secondary">
                            Подрядчик: <span className="font-medium text-text-primary">{part.contractor}</span>
                          </span>
                          <span className="text-text-tertiary">|</span>
                          <span className="text-text-secondary">
                            Закупка: <span className="font-mono font-medium text-text-primary">{formatMoney(part.purchasePricePerUnit)}/шт</span>
                          </span>
                          <Button variant="ghost" size="sm">
                            <ArrowSquareOut size={12} className="mr-1" />{part.subDeal}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {part.operations.map((op) => (
                          <div
                            key={op.code}
                            title={op.label}
                            className={`flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs font-medium ${
                              op.status === "done"        ? "bg-success-light text-[var(--color-success-700)]" :
                              op.status === "in_progress" ? "bg-primary-light text-primary ring-1 ring-primary/30" :
                              "bg-subtle text-text-tertiary"
                            }`}
                          >
                            {op.status === "done"        ? <CheckCircle size={14} weight="fill" /> :
                             op.status === "in_progress" ? <Spinner size={14} className="animate-spin" /> :
                             <Circle size={14} />}
                            {op.code}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-[13px] text-text-tertiary">Нет детализации по деталям</div>
              )}

              <div className="px-4 py-2 border-t border-border">
                <Button variant="ghost" size="sm"><Plus size={14} className="mr-1" />Добавить деталь</Button>
              </div>
            </Card>
          ))}

          {/* Totals */}
          <Card className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">Себестоимость</p>
              <p className="text-xl font-semibold font-mono tabular-nums">{formatMoney(costTotal)}</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-text-secondary">Цена клиенту</p>
              <p className="text-xl font-semibold font-mono tabular-nums text-primary">{formatMoney(deal.saleAmount)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-text-secondary">Маржа</p>
              <p className="text-xl font-semibold font-mono tabular-nums text-success">
                {formatMoney(margin)} <span className="text-sm text-text-secondary">({marginPct}%)</span>
              </p>
            </div>
          </Card>

          <Button variant="outline" className="w-full sm:w-auto">
            <Plus size={16} className="mr-1.5" />Добавить позицию
          </Button>
        </div>
      )}

      {activeTab !== "positions" && (
        <div className="py-12 text-center text-text-tertiary text-sm">
          Раздел «{TABS.find((t) => t.id === activeTab)?.label}» — в разработке
        </div>
      )}
    </div>
  );
}
