"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { COUNTERPARTIES, DEALS } from "@/lib/mock-data";
import {
  Plus, MagnifyingGlass, Star, Lock, MapPin, Buildings, ShieldCheck, Handshake,
} from "@phosphor-icons/react";

const TABS = [
  { label: "Все",          filter: null },
  { label: "Поставщики",   filter: "Поставщик" },
  { label: "Подрядчики",   filter: "Подрядчик" },
  { label: "Клиенты",      filter: "Клиент" },
];

export default function CounterpartiesPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const filtered = COUNTERPARTIES.filter((c) => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = TABS[activeTab].filter == null || c.role === TABS[activeTab].filter;
    return matchesSearch && matchesTab;
  });

  // Считаем сделки по каждому контрагенту из реального массива
  const dealsByClient = DEALS.reduce<Record<string, number>>((acc, d) => {
    acc[d.client] = (acc[d.client] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Контрагенты</h1>
        <Button size="md"><Plus size={16} weight="bold" className="mr-1.5" />Добавить</Button>
      </div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab, i) => {
          const count = COUNTERPARTIES.filter((c) => tab.filter == null || c.role === tab.filter).length;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${activeTab === i ? "bg-primary/10 text-primary" : "bg-subtle text-text-tertiary"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, ИНН..."
            className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((company) => {
          // Показываем реальные сделки для клиентов
          const realDeals = dealsByClient[company.name] ?? company.dealsCount;
          return (
            <Card key={company.id} hover className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar initials={company.name.slice(0, 2).replace("О", "О").replace("«", "")} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-text-primary truncate">{company.name}</h3>
                      {company.verified && (
                        <ShieldCheck size={14} className="shrink-0 text-primary" title="Верифицирован" />
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary">ИНН: {company.inn}</p>
                  </div>
                </div>
                <Badge variant={company.role === "Клиент" ? "primary" : company.role === "Подрядчик" ? "secondary" : "default"} size="sm">
                  {company.role}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {company.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-subtle text-text-secondary px-2 py-0.5 text-[11px]">{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1"><MapPin size={12} />{company.region}</span>
                {company.capacity && <span className="text-text-tertiary">·</span>}
                {company.capacity && <span>{company.capacity}</span>}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="flex items-center gap-1">
                    <Star size={12} weight="fill" className="text-warning" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="text-text-tertiary">({company.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Handshake size={12} />
                    {realDeals} сделок
                  </span>
                </div>
                {company.contactsRevealed ? (
                  <Button variant="outline" size="sm">Контакты</Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-text-tertiary">
                    <Lock size={13} className="mr-1" />Закрыто
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
