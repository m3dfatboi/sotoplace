"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck, CurrencyCircleDollar, CheckCircle, ChatCircle, FileText, DownloadSimple, Phone, At } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTimeline, type TimelineStep } from "@/components/ui/status-timeline";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

// ─── Static data ─────────────────────────────────────────────────────────────

const dealId = "#2847";
const client = "ООО «ОфисПлюс»";
const manager = { name: "Алексей Краснов", initials: "АК", phone: "+7 (495) 123-45-67", email: "akrasnov@sotoplace.ru" };

const timeline: TimelineStep[] = [
  { label: "Заказ принят",      status: "completed", date: "1 мар" },
  { label: "КП согласовано",    status: "completed", date: "5 мар" },
  { label: "В производстве",    status: "current",   date: "8 мар" },
  { label: "Готово к отгрузке", status: "upcoming" },
  { label: "Доставка",          status: "upcoming" },
  { label: "Завершено",         status: "upcoming" },
];

const positions = [
  { id: 1, name: "Стол офисный СТ-120",  sku: "CT-120-BK", qty: 5,  unitPrice: 12500, readyPct: 80 },
  { id: 2, name: "Кресло оператора КР-45", sku: "KR-45-GR", qty: 10, unitPrice: 8900, readyPct: 60 },
];

const documents = [
  { name: "Счёт #2847",           type: "PDF", date: "5 мар 2026" },
  { name: "Договор поставки",     type: "PDF", date: "5 мар 2026" },
  { name: "Спецификация изделий", type: "PDF", date: "8 мар 2026" },
];

const payments = [
  { label: "Аванс 50%",      amount: 82000, date: "6 мар 2026",  status: "paid"    as const },
  { label: "Оплата остатка", amount: 82000, date: "15 мар 2026", status: "pending" as const },
];

function formatPrice(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }

const total = positions.reduce((s, p) => s + p.unitPrice * p.qty, 0);
const totalReady = Math.round(positions.reduce((s, p) => s + p.readyPct * p.qty, 0) / positions.reduce((s, p) => s + p.qty, 0));

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientViewPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/deals">
            <button className="rounded-[var(--radius-md)] p-2 hover:bg-subtle transition-colors text-text-secondary">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-[-0.01em]">Заказ {dealId}</h1>
              <Badge variant="primary">В производстве</Badge>
            </div>
            <p className="text-sm text-text-secondary mt-0.5">{client}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <ChatCircle size={15} />
          Написать менеджеру
        </Button>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-text-primary">Общая готовность заказа</p>
            <span className="text-lg font-bold text-primary">{totalReady}%</span>
          </div>
          <Progress value={totalReady} color="primary" size="lg" />
          <p className="mt-2 text-xs text-text-secondary">
            Ожидаемая дата отгрузки: <span className="font-medium text-text-primary">20 марта 2026</span>
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Статус заказа</CardTitle>
        </CardHeader>
        <CardContent className="pb-5">
          <StatusTimeline steps={timeline} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Состав заказа</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {positions.map((pos) => (
                <div key={pos.id} className="rounded-[var(--radius-lg)] border border-border p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-medium text-text-primary">{pos.name}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">SKU: {pos.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-text-primary">{formatPrice(pos.unitPrice * pos.qty)}</p>
                      <p className="text-xs text-text-tertiary">{pos.qty} шт. × {formatPrice(pos.unitPrice)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={pos.readyPct} color={pos.readyPct >= 80 ? "success" : "primary"} className="flex-1" />
                    <span className="text-xs font-medium text-text-secondary shrink-0">{pos.readyPct}% готово</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-border font-semibold text-text-primary">
                <span>Итого</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Документы</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-2">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border px-3 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="shrink-0 text-text-tertiary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-text-tertiary">{doc.type} · {doc.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <DownloadSimple size={15} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Оплата</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-3 text-sm">
              {payments.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-text-primary">{p.label}</p>
                    <p className="text-xs text-text-tertiary">{p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">{formatPrice(p.amount)}</p>
                    <Badge size="sm" variant={p.status === "paid" ? "success" : "default"}>
                      {p.status === "paid" ? "Оплачено" : "Ожидается"}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-text-primary">
                <span>Сумма заказа</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Manager contact */}
          <Card>
            <CardHeader>
              <CardTitle>Ваш менеджер</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar initials={manager.initials} size="lg" />
                <div>
                  <p className="font-medium text-text-primary text-sm">{manager.name}</p>
                  <p className="text-xs text-text-tertiary">Менеджер по продажам</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <a href={`tel:${manager.phone}`} className="flex items-center gap-2 hover:text-text-primary transition-colors">
                  <Phone size={14} className="shrink-0" />{manager.phone}
                </a>
                <a href={`mailto:${manager.email}`} className="flex items-center gap-2 hover:text-text-primary transition-colors">
                  <At size={14} className="shrink-0" />{manager.email}
                </a>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                <ChatCircle size={15} />
                Написать в чат
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
