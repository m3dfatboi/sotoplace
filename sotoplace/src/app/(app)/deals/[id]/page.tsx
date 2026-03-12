"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { StatusTimeline, type TimelineStep } from "@/components/ui/status-timeline";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { getDeal, getDealCostTotal, getDealMargin, getDealMarginPct, formatMoney, type DealStatus, type DealPosition, type DealPart } from "@/lib/mock-data";
import {
  ArrowLeft, Printer, DotsThree, CheckCircle, Circle, Spinner,
  ChatCircle, FileText, Truck, CurrencyCircleDollar, ClockCounterClockwise,
  Plus, ArrowSquareOut, Eye, X, Check,
} from "@phosphor-icons/react";

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

const ACTIONS_MENU = ["Изменить статус", "Назначить менеджера", "Клонировать сделку", "Экспорт в PDF"];

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const baseDeal = getDeal(id);

  const [activeTab, setActiveTab] = useState("positions");
  const [positions, setPositions] = useState<DealPosition[]>(baseDeal?.positions ?? []);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Add position modal
  const [addPosOpen, setAddPosOpen] = useState(false);
  const [newPos, setNewPos] = useState({ name: "", qty: "1", price: "" });

  // Add part modal
  const [addPartFor, setAddPartFor] = useState<string | null>(null); // positionId
  const [newPart, setNewPart] = useState({ name: "", contractor: "", price: "" });

  if (!baseDeal) {
    return (
      <EmptyState
        title="Сделка не найдена"
        description={`Сделка #${id} не существует`}
        action={{ label: "Все сделки", onClick: () => router.push("/deals") }}
      />
    );
  }

  const deal = { ...baseDeal, positions };
  const costTotal = positions.reduce((sum, p) => sum + p.costTotal, 0);
  const margin = deal.saleAmount - costTotal;
  const marginPct = deal.saleAmount > 0 ? Math.round((margin / deal.saleAmount) * 100) : 0;
  const timeline = buildTimeline(deal.status);

  const presenceUsers = [
    { name: deal.managerName, online: true },
    { name: "Алексей Козлов", online: true },
    { name: "Мария Петрова",  online: false },
  ];

  function submitNewPosition() {
    if (!newPos.name.trim()) return;
    const qty = Number(newPos.qty) || 1;
    const price = Number(newPos.price) || 0;
    setPositions((prev) => [...prev, {
      id: `pos-${Date.now()}`,
      productId: "",
      name: newPos.name,
      sku: "—",
      qty,
      costPerUnit: price,
      costTotal: qty * price,
      parts: [],
    }]);
    setNewPos({ name: "", qty: "1", price: "" });
    setAddPosOpen(false);
  }

  function submitNewPart() {
    if (!newPart.name.trim() || !addPartFor) return;
    const price = Number(newPart.price) || 0;
    setPositions((prev) => prev.map((p) =>
      p.id === addPartFor
        ? { ...p, parts: [...p.parts, {
            id: `part-${Date.now()}`,
            name: newPart.name,
            contractor: newPart.contractor || "—",
            purchasePricePerUnit: price,
            subDeal: `#SUB-${id}-${p.parts.length + 1}`,
            operations: [
              { code: "TR" as const, label: "Транспортировка", status: "pending" as const },
              { code: "OK" as const, label: "ОТК",              status: "pending" as const },
            ],
          }] }
        : p
    ));
    setNewPart({ name: "", contractor: "", price: "" });
    setAddPartFor(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/deals">
            <Button variant="ghost" size="sm"><ArrowLeft size={16} className="mr-1" />Сделки</Button>
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

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <AvatarStack users={presenceUsers} max={3} size="sm" />
              <span className="text-xs text-text-tertiary hidden sm:inline">Сейчас в сделке</span>
            </div>
            <div className="h-5 w-px bg-border" />
            <Link href={`/deals/${id}/client-view`}>
              <Button variant="outline" size="sm"><Eye size={14} className="mr-1.5" />Вид клиента</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={14} className="mr-1.5" />Печать
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setActionsOpen((v) => !v)}>
                <DotsThree size={18} weight="bold" />
              </Button>
              {actionsOpen && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg py-1 min-w-[190px]">
                  {ACTIONS_MENU.map((action) => (
                    <button key={action} onClick={() => setActionsOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-subtle transition-colors text-text-primary">
                      {action}
                    </button>
                  ))}
                  <div className="border-t border-border my-1" />
                  <button onClick={() => { setActionsOpen(false); setCancelOpen(true); }}
                    className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/5 transition-colors">
                    Отменить сделку
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <StatusTimeline steps={timeline} />
        {deal.slaDeadline !== "—" && (
          <p className="text-xs text-text-secondary mt-3 text-center">
            SLA: {deal.slaDeadline} · Осталось:{" "}
            <span className={deal.slaOk ? "text-text-primary font-medium" : "text-danger font-medium"}>{deal.slaRemaining}</span>
          </p>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {tab.count && <span className="rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[11px]">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Positions tab */}
      {activeTab === "positions" && (
        <div className="space-y-4">
          {positions.map((pos, idx) => (
            <Card key={pos.id} padding="none">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-text-secondary">{idx + 1}</span>
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
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/deals/${id}`)}>
                            <ArrowSquareOut size={12} className="mr-1" />{part.subDeal}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {part.operations.map((op) => (
                          <div key={op.code} title={op.label}
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
                <Button variant="ghost" size="sm" onClick={() => { setAddPartFor(pos.id); setNewPart({ name: "", contractor: "", price: "" }); }}>
                  <Plus size={14} className="mr-1" />Добавить деталь
                </Button>
              </div>
            </Card>
          ))}

          {/* Totals */}
          <Card className="flex items-center justify-between flex-wrap gap-4">
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

          <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setNewPos({ name: "", qty: "1", price: "" }); setAddPosOpen(true); }}>
            <Plus size={16} className="mr-1.5" />Добавить позицию
          </Button>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== "positions" && (
        <div className="py-12 text-center text-text-tertiary text-sm">
          Раздел «{TABS.find((t) => t.id === activeTab)?.label}» — в разработке
        </div>
      )}

      {/* Add Position Modal */}
      <Modal open={addPosOpen} onClose={() => setAddPosOpen(false)} title="Добавить позицию" size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddPosOpen(false)}>Отмена</Button>
            <Button onClick={submitNewPosition} disabled={!newPos.name.trim()}>Добавить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Название товара / услуги *</label>
            <input type="text" value={newPos.name} onChange={(e) => setNewPos((d) => ({ ...d, name: e.target.value }))}
              placeholder="Стол офисный СТ-120"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Количество, шт</label>
              <input type="number" min={1} value={newPos.qty} onChange={(e) => setNewPos((d) => ({ ...d, qty: e.target.value }))}
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Цена за единицу, ₽</label>
              <input type="number" min={0} value={newPos.price} onChange={(e) => setNewPos((d) => ({ ...d, price: e.target.value }))}
                placeholder="0"
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          {newPos.qty && newPos.price && (
            <p className="text-sm text-text-secondary">
              Итого: <span className="font-semibold text-text-primary">{formatMoney(Number(newPos.qty) * Number(newPos.price))}</span>
            </p>
          )}
        </div>
      </Modal>

      {/* Add Part Modal */}
      <Modal open={!!addPartFor} onClose={() => setAddPartFor(null)} title="Добавить деталь" size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddPartFor(null)}>Отмена</Button>
            <Button onClick={submitNewPart} disabled={!newPart.name.trim()}>Добавить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Название детали *</label>
            <input type="text" value={newPart.name} onChange={(e) => setNewPart((d) => ({ ...d, name: e.target.value }))}
              placeholder="Каркас, столешница, ножки..."
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Подрядчик</label>
            <input type="text" value={newPart.contractor} onChange={(e) => setNewPart((d) => ({ ...d, contractor: e.target.value }))}
              placeholder="РезкаПро, МеталлПро..."
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Закупочная цена за шт, ₽</label>
            <input type="number" min={0} value={newPart.price} onChange={(e) => setNewPart((d) => ({ ...d, price: e.target.value }))}
              placeholder="0"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Modal>

      {/* Cancel Deal Confirm */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => { setCancelOpen(false); router.push("/deals"); }}
        title="Отменить сделку?"
        description={`Сделка ${deal.num} (${deal.client}) будет отменена. Это действие нельзя отменить.`}
        confirmLabel="Отменить сделку"
        danger
      />
    </div>
  );
}
