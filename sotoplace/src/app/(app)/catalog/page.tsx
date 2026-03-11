"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlass,
  Funnel,
  SquaresFour,
  ListBullets,
  ShoppingCart,
  Heart,
  Star,
  X,
  QrCode,
} from "@phosphor-icons/react";

const filters = [
  { label: "Металлообработка", active: true },
  { label: "Мебель", active: false },
  { label: "В наличии", active: true },
];

const products = [
  { id: "1", name: "Стол офисный СТ-120",          sku: "CT-120-BK",  price: "12 500 ₽", vendor: "МеталлПро",  rating: 4.8, inStock: true,  tags: ["Мебель", "Металлокаркас"] },
  { id: "2", name: "Кресло оператора КР-45",        sku: "KR-45-GR",   price: "8 900 ₽",  vendor: "МеталлПро",  rating: 4.5, inStock: true,  tags: ["Мебель"] },
  { id: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200",    price: "24 800 ₽", vendor: "Полка Про",  rating: 4.9, inStock: true,  tags: ["Хранение", "Металлоконструкции"] },
  { id: "4", name: "Верстак слесарный ВС-1500",     sku: "VS-1500",    price: "45 000 ₽", vendor: "РезкаПро",   rating: 4.7, inStock: false, tags: ["Оборудование", "Металлообработка"] },
  { id: "5", name: "Шкаф инструментальный ШИ-04",   sku: "SHI-04",     price: "18 300 ₽", vendor: "МеталлПро",  rating: 4.6, inStock: true,  tags: ["Хранение"] },
  { id: "6", name: "Тумба подкатная ТП-3",          sku: "TP-3-BK",    price: "9 200 ₽",  vendor: "Полка Про",  rating: 4.4, inStock: true,  tags: ["Мебель"] },
  { id: "7", name: "Лазерная резка на заказ",       sku: "SVC-LASER",  price: "от 500 ₽/дет", vendor: "РезкаПро", rating: 5.0, inStock: true, tags: ["Услуги", "Металлообработка"] },
  { id: "8", name: "Порошковая покраска",           sku: "SVC-PAINT",  price: "от 200 ₽/м²", vendor: "КраскаПро", rating: 4.3, inStock: true, tags: ["Услуги", "Покрытия"] },
];

export default function CatalogPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState(["Металлообработка", "В наличии"]);

  const removeFilter = (label: string) => setActiveFilters((f) => f.filter((x) => x !== label));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Каталог</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode size={16} className="mr-1.5" />
            Сканировать QR
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="search"
              placeholder="Поиск товаров, услуг, мощностей..."
              className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
          <Button variant="outline" size="sm">
            <Funnel size={16} className="mr-1.5" />Фильтры
          </Button>
          <div className="hidden sm:flex items-center border border-border rounded-[var(--radius-md)] overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-subtle text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>
              <SquaresFour size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-subtle text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>
              <ListBullets size={16} />
            </button>
          </div>
        </div>

        {/* Active filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((f) => (
            <button
              key={f}
              onClick={() => removeFilter(f)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-light text-[var(--color-primary-700)] px-3 py-1 text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              {f}<X size={12} />
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button onClick={() => setActiveFilters([])} className="text-xs text-text-secondary hover:text-text-primary transition-colors">
              Сбросить все
            </button>
          )}
          <span className="ml-auto text-[13px] text-text-secondary">{products.length} позиций</span>
        </div>
      </div>

      {/* Products */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
        {products.map((product) =>
          viewMode === "grid" ? (
            <Card
              key={product.id}
              hover
              padding="none"
              className="overflow-hidden group cursor-pointer"
              onClick={() => router.push(`/catalog/${product.id}`)}
            >
              <div className="aspect-[16/10] bg-subtle flex items-center justify-center relative">
                <span className="text-4xl text-text-tertiary/30 font-bold">{product.name.charAt(0)}</span>
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-surface/80 text-text-tertiary hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="В избранное"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart size={16} />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-text-primary truncate">{product.name}</h3>
                  <p className="text-xs text-text-tertiary font-mono mt-0.5">{product.sku}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Star size={12} weight="fill" className="text-warning" />
                  <span>{product.rating}</span>
                  <span className="text-text-tertiary">·</span>
                  <span className="truncate">{product.vendor}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold tabular-nums">{product.price}</span>
                  {product.inStock ? <Badge variant="success">В наличии</Badge> : <Badge variant="default">Под заказ</Badge>}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); router.push("/cart"); }}
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    В корзину
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card
              key={product.id}
              hover
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => router.push(`/catalog/${product.id}`)}
            >
              <div className="h-16 w-16 rounded-[var(--radius-md)] bg-subtle flex items-center justify-center shrink-0">
                <span className="text-xl text-text-tertiary/30 font-bold">{product.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-primary truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-tertiary font-mono">{product.sku}</span>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-xs text-text-secondary">{product.vendor}</span>
                  <Star size={10} weight="fill" className="text-warning" />
                  <span className="text-xs text-text-secondary">{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                {product.inStock ? <Badge variant="success">В наличии</Badge> : <Badge variant="default">Под заказ</Badge>}
                <span className="text-sm font-semibold tabular-nums whitespace-nowrap">{product.price}</span>
                <Button size="sm" onClick={() => router.push("/cart")}>
                  <ShoppingCart size={14} />
                </Button>
              </div>
            </Card>
          )
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-text-secondary">Показано 1–8 из 247</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>←</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="ghost" size="sm">2</Button>
          <Button variant="ghost" size="sm">3</Button>
          <span className="px-1 text-text-tertiary">...</span>
          <Button variant="ghost" size="sm">12</Button>
          <Button variant="outline" size="sm">→</Button>
        </div>
      </div>
    </div>
  );
}
