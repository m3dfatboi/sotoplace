"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Combobox } from "@/components/ui/combobox";
import { COUNTERPARTIES } from "@/lib/mock-data";
import {
  MagnifyingGlass, Funnel, Plus, DotsThree, Export,
  ArrowsDownUp, X, Check, CaretDown, CaretUp,
} from "@phosphor-icons/react";

type DealStatus = "primary" | "warning" | "success" | "secondary" | "danger" | "default";

interface Deal {
  id: string; num: string; client: string; amount: string; amountNum: number;
  status: string; statusVariant: DealStatus; sla: string; slaOk: boolean;
  stage: string; date: string; manager: string; tab: "all" | "mine" | "attention" | "archive";
}

const INITIAL_DEALS: Deal[] = [
  { id: "2847", num: "#2847", client: "ООО «ОфисПлюс»",   amount: "164 000 ₽",   amountNum: 164000,   status: "Производство",      statusVariant: "primary",   sla: "2д",     slaOk: true,  stage: "4/6", date: "8 мар",  manager: "Иван С.",    tab: "all" },
  { id: "2846", num: "#2846", client: "СтройМаг",          amount: "89 000 ₽",    amountNum: 89000,    status: "Ожидает оплату",    statusVariant: "warning",   sla: "1ч",     slaOk: false, stage: "2/6", date: "7 мар",  manager: "Иван С.",    tab: "attention" },
  { id: "2845", num: "#2845", client: "Домострой",         amount: "540 000 ₽",   amountNum: 540000,   status: "Готово к отгрузке", statusVariant: "success",   sla: "—",      slaOk: true,  stage: "5/6", date: "5 мар",  manager: "Мария П.",   tab: "all" },
  { id: "2844", num: "#2844", client: "ИП Краснов М.А.",  amount: "32 500 ₽",    amountNum: 32500,    status: "Согласование",      statusVariant: "secondary", sla: "5д",     slaOk: true,  stage: "3/6", date: "4 мар",  manager: "Иван С.",    tab: "all" },
  { id: "2843", num: "#2843", client: "МебельОпт",         amount: "1 200 000 ₽", amountNum: 1200000,  status: "Просрочено!",       statusVariant: "danger",    sla: "⚠️ -2д", slaOk: false, stage: "4/6", date: "1 мар",  manager: "Мария П.",   tab: "attention" },
  { id: "2842", num: "#2842", client: "ООО «Техно»",       amount: "75 000 ₽",    amountNum: 75000,    status: "Черновик",          statusVariant: "default",   sla: "—",      slaOk: true,  stage: "1/6", date: "28 фев", manager: "Иван С.",    tab: "archive" },
  { id: "2841", num: "#2841", client: "Складские решения", amount: "320 000 ₽",   amountNum: 320000,   status: "Производство",      statusVariant: "primary",   sla: "4д",     slaOk: true,  stage: "4/6", date: "25 фев", manager: "Алексей К.", tab: "all" },
];

const CLIENT_OPTIONS = COUNTERPARTIES.map((c) => ({
  value: c.name,
  label: c.name,
  description: `${c.role} · ${c.region}`,
  badge: c.verified ? "✓" : undefined,
}));

const STATUS_OPTIONS = [
  { label: "Черновик",          value: "Черновик",          variant: "default"   as DealStatus },
  { label: "Производство",      value: "Производство",      variant: "primary"   as DealStatus },
  { label: "Согласование",      value: "Согласование",      variant: "secondary" as DealStatus },
  { label: "Ожидает оплату",    value: "Ожидает оплату",    variant: "warning"   as DealStatus },
  { label: "Готово к отгрузке", value: "Готово к отгрузке", variant: "success"   as DealStatus },
  { label: "Просрочено!",       value: "Просрочено!",       variant: "danger"    as DealStatus },
];

const PERIOD_OPTIONS = ["Сегодня", "Неделя", "Месяц", "Квартал", "Год"];
const SORT_OPTIONS = [
  { label: "По дате (новые)",  field: "date",   dir: "desc" as const },
  { label: "По дате (старые)", field: "date",   dir: "asc"  as const },
  { label: "По сумме ↑",       field: "amount", dir: "asc"  as const },
  { label: "По сумме ↓",       field: "amount", dir: "desc" as const },
  { label: "По клиенту А–Я",   field: "client", dir: "asc"  as const },
];
const MANAGERS = ["Иван С.", "Мария П.", "Алексей К."];
const PAGE_SIZE = 5;

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, cb]);
}

function FilterDropdown({ label, open, onToggle, onClose, children }: {
  label: string; open: boolean; onToggle: () => void; onClose: () => void; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={onToggle}>
        <Funnel size={14} />
        <span className="mx-1.5">{label}</span>
        {open ? <CaretUp size={12} /> : <CaretDown size={12} />}
      </Button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg py-1.5 min-w-[190px]">
          {children}
        </div>
      )}
    </div>
  );
}

function SortDropdown({ sort, setSort, open, onToggle, onClose }: {
  sort: typeof SORT_OPTIONS[number]; setSort: (s: typeof SORT_OPTIONS[number]) => void;
  open: boolean; onToggle: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={onToggle}>
        <ArrowsDownUp size={14} /><span className="mx-1.5">{sort.label}</span>
        {open ? <CaretUp size={12} /> : <CaretDown size={12} />}
      </Button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg py-1.5 min-w-[190px]">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.label} onClick={() => { setSort(opt); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-subtle transition-colors ${sort.label === opt.label ? "text-primary font-medium" : "text-text-primary"}`}
            >
              {opt.label}{sort.label === opt.label && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DealsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string | null>(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ client: "", manager: "Иван С.", amount: "", sla: "" });
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Open modal if ?new=1
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setNewDealOpen(true);
      router.replace("/deals");
    }
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    let items = deals;
    if (activeTab === 1) items = items.filter((d) => d.manager === "Иван С.");
    if (activeTab === 2) items = items.filter((d) => !d.slaOk);
    if (activeTab === 3) items = items.filter((d) => d.tab === "archive");
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((d) => d.num.toLowerCase().includes(q) || d.client.toLowerCase().includes(q) || d.manager.toLowerCase().includes(q));
    }
    if (statusFilter) items = items.filter((d) => d.status === statusFilter);
    return [...items].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.field === "amount") return (a.amountNum - b.amountNum) * dir;
      if (sort.field === "client") return a.client.localeCompare(b.client) * dir;
      return 0;
    });
  }, [deals, activeTab, search, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { label: "Все",              count: deals.length },
    { label: "Мои",              count: deals.filter((d) => d.manager === "Иван С.").length },
    { label: "Требуют внимания", count: deals.filter((d) => !d.slaOk).length },
    { label: "Архив",            count: deals.filter((d) => d.tab === "archive").length },
  ];

  function handleTabChange(i: number) { setActiveTab(i); setPage(1); }
  function handleSearch(val: string) { setSearch(val); setPage(1); }

  function submitNewDeal() {
    if (!newDeal.client.trim()) return;
    const num = String(Math.max(...deals.map((d) => Number(d.id))) + 1);
    setDeals((prev) => [{
      id: num, num: `#${num}`, client: newDeal.client,
      amount: newDeal.amount ? `${Number(newDeal.amount).toLocaleString("ru")} ₽` : "—",
      amountNum: Number(newDeal.amount) || 0,
      status: "Черновик", statusVariant: "default", sla: "—", slaOk: true,
      stage: "1/6", date: "сегодня", manager: newDeal.manager, tab: "all",
    }, ...prev]);
    setNewDeal({ client: "", manager: "Иван С.", amount: "", sla: "" });
    setNewDealOpen(false);
  }

  function deleteDeal(id: string) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setActionMenuId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Сделки</h1>
        <Button size="md" onClick={() => setNewDealOpen(true)}>
          <Plus size={16} weight="bold" className="mr-1.5" />Новая сделка
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab.label} onClick={() => handleTabChange(i)}
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
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="search" value={search} onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск по номеру, клиенту, менеджеру..."
            className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"><X size={14} /></button>}
        </div>

        <FilterDropdown label={statusFilter || "Статус"} open={statusOpen}
          onToggle={() => { setStatusOpen((v) => !v); setPeriodOpen(false); setSortOpen(false); }}
          onClose={() => setStatusOpen(false)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setStatusOpen(false); setPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-subtle transition-colors ${statusFilter === opt.value ? "text-primary font-medium" : "text-text-primary"}`}
            >
              <Badge variant={opt.variant} dot>{opt.label}</Badge>
              {statusFilter === opt.value && <Check size={14} />}
            </button>
          ))}
          {statusFilter && (<><div className="border-t border-border my-1" />
            <button onClick={() => { setStatusFilter(null); setStatusOpen(false); setPage(1); }}
              className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-subtle">Сбросить</button></>
          )}
        </FilterDropdown>

        <FilterDropdown label={periodFilter || "Период"} open={periodOpen}
          onToggle={() => { setPeriodOpen((v) => !v); setStatusOpen(false); setSortOpen(false); }}
          onClose={() => setPeriodOpen(false)}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <button key={opt} onClick={() => { setPeriodFilter(opt); setPeriodOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-subtle transition-colors ${periodFilter === opt ? "text-primary font-medium" : "text-text-primary"}`}
            >
              {opt}{periodFilter === opt && <Check size={14} />}
            </button>
          ))}
          {periodFilter && (<><div className="border-t border-border my-1" />
            <button onClick={() => { setPeriodFilter(null); setPeriodOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-subtle">Сбросить</button></>
          )}
        </FilterDropdown>

        <SortDropdown sort={sort} setSort={setSort} open={sortOpen}
          onToggle={() => { setSortOpen((v) => !v); setStatusOpen(false); setPeriodOpen(false); }}
          onClose={() => setSortOpen(false)}
        />

        <Button variant="ghost" size="sm" onClick={() => {
          const rows = filtered.map((d) => [d.num, d.client, d.amount, d.status, d.manager, d.date].join(",")).join("\n");
          const blob = new Blob([`Сделка,Клиент,Сумма,Статус,Менеджер,Дата\n${rows}`], { type: "text/csv" });
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "deals.csv"; a.click();
        }}>
          <Export size={14} className="mr-1.5" />Экспорт
        </Button>

        {(statusFilter || periodFilter) && (
          <button onClick={() => { setStatusFilter(null); setPeriodFilter(null); setPage(1); }}
            className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1">
            <X size={12} />Сбросить фильтры
          </button>
        )}
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-left text-[13px] text-text-secondary">
                <th className="px-4 py-3 font-medium w-10"><input type="checkbox" className="h-4 w-4 rounded border-border" /></th>
                <th className="px-4 py-3 font-medium">№ сделки</th>
                <th className="px-4 py-3 font-medium">Контрагент</th>
                <th className="px-4 py-3 font-medium text-right">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Этап</th>
                <th className="px-4 py-3 font-medium text-right">SLA</th>
                <th className="px-4 py-3 font-medium">Менеджер</th>
                <th className="px-4 py-3 font-medium text-right">Дата</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-text-tertiary text-sm">Ничего не найдено</td></tr>
              ) : paginated.map((deal) => (
                <tr key={deal.id} onClick={() => router.push(`/deals/${deal.id}`)}
                  className="border-b border-border last:border-0 hover:bg-subtle/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="h-4 w-4 rounded border-border" /></td>
                  <td className="px-4 py-3 font-medium font-mono text-[13px] text-primary">{deal.num}</td>
                  <td className="px-4 py-3 font-medium">{deal.client}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{deal.amount}</td>
                  <td className="px-4 py-3"><Badge variant={deal.statusVariant} dot>{deal.status}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary text-[13px]">{deal.stage}</td>
                  <td className={`px-4 py-3 text-right text-[13px] font-medium ${deal.slaOk ? "text-text-secondary" : "text-danger"}`}>{deal.sla}</td>
                  <td className="px-4 py-3 text-text-secondary">{deal.manager}</td>
                  <td className="px-4 py-3 text-right text-text-tertiary text-[13px]">{deal.date}</td>
                  <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button onClick={() => setActionMenuId(actionMenuId === deal.id ? null : deal.id)}
                        className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors">
                        <DotsThree size={18} weight="bold" />
                      </button>
                      {actionMenuId === deal.id && (
                        <div className="absolute right-0 top-full mt-1 z-30 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg py-1 min-w-[160px]">
                          <button onClick={() => { router.push(`/deals/${deal.id}`); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-subtle">Открыть</button>
                          <button onClick={() => { router.push(`/deals/${deal.id}/client-view`); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-subtle">Вид клиента</button>
                          <div className="border-t border-border my-1" />
                          <button onClick={() => deleteDeal(deal.id)} className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/5">Удалить</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-[13px] text-text-secondary">
            {filtered.length === 0 ? "Ничего не найдено"
              : `Показано ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} из ${filtered.length}`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "primary" : "ghost"} size="sm" onClick={() => setPage(p)}>{p}</Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
            </div>
          )}
        </div>
      </Card>

      {/* New Deal Modal */}
      <Modal open={newDealOpen} onClose={() => setNewDealOpen(false)} title="Новая сделка"
        description="Создайте черновик сделки. Детали можно заполнить после." size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewDealOpen(false)}>Отмена</Button>
            <Button onClick={submitNewDeal} disabled={!newDeal.client.trim()}>Создать сделку</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Контрагент *</label>
            <Combobox
              options={CLIENT_OPTIONS}
              value={newDeal.client}
              onChange={(v) => setNewDeal((d) => ({ ...d, client: v }))}
              placeholder="Выберите или введите компанию"
              searchPlaceholder="Поиск по названию, региону..."
              allowCustom
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Сумма сделки, ₽</label>
              <input type="number" value={newDeal.amount} onChange={(e) => setNewDeal((d) => ({ ...d, amount: e.target.value }))}
                placeholder="0" min={0}
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">SLA дедлайн</label>
              <input type="date" value={newDeal.sla} onChange={(e) => setNewDeal((d) => ({ ...d, sla: e.target.value }))}
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Ответственный менеджер</label>
            <select value={newDeal.manager} onChange={(e) => setNewDeal((d) => ({ ...d, manager: e.target.value }))}
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense>
      <DealsPageInner />
    </Suspense>
  );
}
