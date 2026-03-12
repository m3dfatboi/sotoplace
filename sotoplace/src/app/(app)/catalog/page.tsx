"use client";

import { useState, useMemo } from "react";
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

const ALL_TAGS = ["Мебель", "Металлообработка", "Металлоконструкции", "Хранение", "Оборудование", "Услуги", "Покрытия"];

const allProducts = [
  { id: "1", name: "Стол офисный СТ-120",          sku: "CT-120-BK",  price: "12 500 ₽",       vendor: "МеталлПро",  rating: 4.8, inStock: true,  tags: ["Мебель", "Металлоконструкции"] },
  { id: "2", name: "Кресло оператора КР-45",        sku: "KR-45-GR",   price: "8 900 ₽",        vendor: "МеталлПро",  rating: 4.5, inStock: true,  tags: ["Мебель"] },
  { id: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200",    price: "24 800 ₽",       vendor: "Полка Про",  rating: 4.9, inStock: true,  tags: ["Хранение", "Металлоконструкции"] },
  { id: "4", name: "Верстак слесарный ВС-1500",     sku: "VS-1500",    price: "45 000 ₽",       vendor: "РезкаПро",   rating: 4.7, inStock: false, tags: ["Оборудование", "Металлообработка"] },
  { id: "5", name: "Шкаф инструментальный ШИ-04",   sku: "SHI-04",     price: "18 300 ₽",       vendor: "МеталлПро",  rating: 4.6, inStock: true,  tags: ["Хранение"] },
  { id: "6", name: "Тумба подкатная ТП-3",          sku: "TP-3-BK",    price: "9 200 ₽",        vendor: "Полка Про",  rating: 4.4, inStock: true,  tags: ["Мебель"] },
  { id: "7", name: "Лазерная резка на заказ",       sku: "SVC-LASER",  price: "от 500 ₽/дет",   vendor: "РезкаПро",   rating: 5.0, inStock: true,  tags: ["Услуги", "Металлообработка"] },
  { id: "8", name: "Порошковая покраска",           sku: "SVC-PAINT",  price: "от 200 ₽/м²",    vendor: "КраскаПро",  rating: 4.3, inStock: true,  tags: ["Услуги", "Покрытия"] },
];

const PAGE_SIZE = 8;

export default function CatalogPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let items = allProducts;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q)
      );
    }

    if (activeFilters.length > 0) {
      items = items.filter((p) => activeFilters.every((f) => p.tags.includes(f)));
    }

    if (onlyInStock) {
      items = items.filter((p) => p.inStock);
    }

    return items;
  }, [search, activeFilters, onlyInStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleFilter(tag: string) {
    setActiveFilters((f) =>
      f.includes(tag) ? f.filter((x) => x !== tag) : [...f, tag]
    );
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

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
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Поиск товаров, услуг, производителей..."
              className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => { setOnlyInStock((v) => !v); setPage(1); }}
            className={`h-9 px-3 rounded-[var(--radius-md)] border text-sm font-medium transition-colors flex items-center gap-1.5 ${
              onlyInStock
                ? "border-success bg-success/10 text-success"
                : "border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Funnel size={14} />
            В наличии
          </button>
          <div className="hidden sm:flex items-center border border-border rounded-[var(--radius-md)] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-subtle text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
            >
              <SquaresFour size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-subtle text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
            >
              <ListBullets size={16} />
            </button>
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilters.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-subtle text-text-secondary hover:bg-subtle/80 hover:text-text-primary"
              }`}
            >
              {tag}
              {activeFilters.includes(tag) && <X size={10} />}
            </button>
          ))}
          {(activeFilters.length > 0 || onlyInStock) && (
            <button
              onClick={() => { setActiveFilters([]); setOnlyInStock(false); setPage(1); }}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors ml-1"
            >
              Сбросить
            </button>
          )}
          <span className="ml-auto text-[13px] text-text-secondary">{filtered.length} позиций</span>
        </div>
      </div>

      {/* Products */}
      {paginated.length === 0 ? (
        <div className="py-20 text-center text-text-tertiary">
          <p className="text-sm">Ничего не найдено</p>
          <button onClick={() => { setSearch(""); setActiveFilters([]); setOnlyInStock(false); }} className="text-xs text-primary mt-2 hover:underline">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
          {paginated.map((product) =>
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
                  <div className="flex gap-1 mt-1">
                    {product.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-subtle text-text-tertiary rounded px-1.5 py-0.5">{t}</span>
                    ))}
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-text-secondary">
            Показано {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} из {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "primary" : "ghost"} size="sm" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
          </div>
        </div>
      )}
    </div>
  );
}
