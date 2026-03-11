"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MagnifyingGlass,
  Funnel,
  Plus,
  DotsThree,
  Export,
  ArrowsDownUp,
} from "@phosphor-icons/react";

const tabs = [
  { label: "Все", count: 142, active: true },
  { label: "Мои", count: 47, active: false },
  { label: "Требуют внимания", count: 3, active: false },
  { label: "Архив", count: 89, active: false },
];

const deals = [
  { id: "2847", num: "#2847", client: "ООО «ОфисПлюс»",    amount: "164 000 ₽", status: "Производство",      statusVariant: "primary"   as const, sla: "2д",     slaOk: true,  stage: "4/6", date: "8 мар",  manager: "Иван С." },
  { id: "2846", num: "#2846", client: "СтройМаг",           amount: "89 000 ₽",  status: "Ожидает оплату",    statusVariant: "warning"   as const, sla: "1ч",     slaOk: false, stage: "2/6", date: "7 мар",  manager: "Иван С." },
  { id: "2845", num: "#2845", client: "Домострой",          amount: "540 000 ₽", status: "Готово к отгрузке", statusVariant: "success"   as const, sla: "—",      slaOk: true,  stage: "5/6", date: "5 мар",  manager: "Мария П." },
  { id: "2844", num: "#2844", client: "ИП Краснов М.А.",   amount: "32 500 ₽",  status: "Согласование",      statusVariant: "secondary" as const, sla: "5д",     slaOk: true,  stage: "3/6", date: "4 мар",  manager: "Иван С." },
  { id: "2843", num: "#2843", client: "МебельОпт",          amount: "1 200 000 ₽", status: "Просрочено!",    statusVariant: "danger"    as const, sla: "⚠️ -2д", slaOk: false, stage: "4/6", date: "1 мар",  manager: "Мария П." },
  { id: "2842", num: "#2842", client: "ООО «Техно»",        amount: "75 000 ₽",  status: "Черновик",          statusVariant: "default"   as const, sla: "—",      slaOk: true,  stage: "1/6", date: "28 фев", manager: "Иван С." },
  { id: "2841", num: "#2841", client: "Складские решения",  amount: "320 000 ₽", status: "Производство",      statusVariant: "primary"   as const, sla: "4д",     slaOk: true,  stage: "4/6", date: "25 фев", manager: "Алексей К." },
];

export default function DealsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Сделки</h1>
        <Button size="md">
          <Plus size={16} weight="bold" className="mr-1.5" />
          Новая сделка
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === i
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${activeTab === i ? "bg-primary/10 text-primary" : "bg-subtle text-text-tertiary"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="search"
            placeholder="Поиск по номеру, клиенту..."
            className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline" size="sm"><Funnel size={14} className="mr-1.5" />Статус</Button>
        <Button variant="outline" size="sm"><Funnel size={14} className="mr-1.5" />Период</Button>
        <Button variant="outline" size="sm"><ArrowsDownUp size={14} className="mr-1.5" />Сортировка</Button>
        <Button variant="ghost" size="sm"><Export size={14} className="mr-1.5" />Экспорт</Button>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-left text-[13px] text-text-secondary">
                <th className="px-4 py-3 font-medium w-10">
                  <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                </th>
                <th className="px-4 py-3 font-medium">№ сделки</th>
                <th className="px-4 py-3 font-medium">Контрагент</th>
                <th className="px-4 py-3 font-medium text-right">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Этап</th>
                <th className="px-4 py-3 font-medium text-right">SLA</th>
                <th className="px-4 py-3 font-medium">Менеджер</th>
                <th className="px-4 py-3 font-medium text-right">Дата</th>
                <th className="px-4 py-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => router.push(`/deals/${deal.id}`)}
                  className="border-b border-border last:border-0 hover:bg-subtle/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                  </td>
                  <td className="px-4 py-3 font-medium font-mono text-[13px] text-primary">{deal.num}</td>
                  <td className="px-4 py-3 font-medium">{deal.client}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{deal.amount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={deal.statusVariant} dot>{deal.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-[13px]">{deal.stage}</td>
                  <td className={`px-4 py-3 text-right text-[13px] font-medium ${deal.slaOk ? "text-text-secondary" : "text-danger"}`}>
                    {deal.sla}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{deal.manager}</td>
                  <td className="px-4 py-3 text-right text-text-tertiary text-[13px]">{deal.date}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 rounded-[var(--radius-sm)] text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors" aria-label="Действия">
                      <DotsThree size={18} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-[13px] text-text-secondary">Показано 1–7 из 142</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>←</Button>
            <Button variant="primary" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="text-text-tertiary px-1">...</span>
            <Button variant="ghost" size="sm">21</Button>
            <Button variant="outline" size="sm">→</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
