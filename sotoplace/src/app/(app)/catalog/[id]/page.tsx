"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  ChatCircle,
  QrCode,
  Heart,
  Minus,
  Plus,
  ShareNetwork,
  Check,
} from "@phosphor-icons/react";

const product = {
  name: "Стол офисный СТ-120",
  sku: "CT-120-BK",
  vendor: "МеталлПро",
  vendorRating: 4.8,
  vendorReviews: 42,
  price: 12500,
  currency: "₽",
  unit: "шт",
  stock: 24,
  leadTimeDays: 5,
  images: [null, null, null, null],
  description:
    "Офисный стол с металлическим каркасом и столешницей из ЛДСП. Порошковая покраска кузова RAL 9005 (чёрный). Регулировка высоты ножек для выравнивания на неровных полах.",
  attributes: [
    { key: "Материал каркаса", value: "Сталь 2мм", unit: null },
    { key: "Покрытие", value: "Порошковая покраска RAL 9005" },
    { key: "Столешница", value: "ЛДСП 25мм" },
    { key: "Размер (Д×Ш×В)", value: "1200×600×750", unit: "мм" },
    { key: "Вес", value: "18", unit: "кг" },
    { key: "Макс. нагрузка", value: "80", unit: "кг" },
  ],
  variants: [
    { id: "1", name: "Стандарт", price: 12500 },
    { id: "2", name: "+ Ящик", price: 14800 },
    { id: "3", name: "+ Экран", price: 16200 },
  ],
};

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeTab, setActiveTab] = useState("attributes");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = [
    { id: "attributes", label: "Характеристики" },
    { id: "variants", label: "Комплектации" },
    { id: "reviews", label: "Отзывы (42)" },
    { id: "docs", label: "Документы" },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={14} className="mr-1" />
          Каталог
        </Button>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-secondary">Мебель</span>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary font-medium">{product.name}</span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-[4/3] rounded-[var(--radius-xl)] bg-subtle border border-border flex items-center justify-center overflow-hidden relative group">
            <span className="text-6xl text-text-tertiary/20 font-bold select-none">
              {product.name.charAt(0)}
            </span>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`h-16 w-16 rounded-[var(--radius-md)] border-2 bg-subtle flex items-center justify-center overflow-hidden transition-colors ${
                  selectedImage === i ? "border-primary" : "border-border hover:border-border-strong"
                }`}
              >
                <span className="text-xs text-text-tertiary">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info + Actions */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">{product.name}</h1>
            <p className="text-sm text-text-tertiary font-mono mt-0.5">Арт: {product.sku}</p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-sm">
                <Star size={14} weight="fill" className="text-warning" />
                <span className="font-medium">{product.vendorRating}</span>
                <span className="text-text-tertiary">·</span>
                <span className="text-text-secondary">{product.vendorReviews} отзывов</span>
              </div>
              <span className="text-text-tertiary">·</span>
              <span className="text-sm text-primary font-medium">{product.vendor}</span>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Price */}
          <div>
            <p className="text-3xl font-bold tabular-nums">
              {selectedVariant.price.toLocaleString("ru-RU")} {product.currency}
              <span className="text-base font-normal text-text-secondary ml-1">
                / {product.unit}
              </span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-sm">
              {product.stock > 0 ? (
                <Badge variant="success">В наличии: {product.stock} шт</Badge>
              ) : (
                <Badge variant="default">Под заказ</Badge>
              )}
              <span className="text-text-secondary">
                Срок: {product.leadTimeDays} раб. дней
              </span>
            </div>
          </div>

          {/* Variants */}
          <div>
            <p className="text-[13px] font-medium mb-2">Комплектация</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`rounded-[var(--radius-md)] border px-3 py-1.5 text-sm transition-colors ${
                    selectedVariant.id === v.id
                      ? "border-primary bg-primary-light text-primary font-medium"
                      : "border-border hover:border-border-strong"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-[13px] font-medium">Количество</p>
            <div className="flex items-center border border-border rounded-[var(--radius-md)] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-9 w-9 flex items-center justify-center text-text-secondary hover:bg-subtle transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="flex h-9 w-12 items-center justify-center text-sm font-medium tabular-nums border-x border-border">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-9 w-9 flex items-center justify-center text-text-secondary hover:bg-subtle transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-text-secondary">
              = {(selectedVariant.price * qty).toLocaleString("ru-RU")} ₽
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 sm:flex-none sm:min-w-[160px]"
              onClick={handleAddToCart}
              variant={addedToCart ? "outline" : "primary"}
            >
              {addedToCart ? (
                <>
                  <Check size={16} className="mr-1.5" />
                  Добавлено!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-1.5" />
                  В корзину
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <ChatCircle size={16} className="mr-1.5" />
              Запросить кастом
            </Button>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <QrCode size={16} />
              QR-код
            </button>
            <span className="text-text-tertiary">·</span>
            <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-danger transition-colors">
              <Heart size={16} />
              В избранное
            </button>
            <span className="text-text-tertiary">·</span>
            <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <ShareNetwork size={16} />
              Поделиться
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "attributes" && (
        <Card>
          <dl className="divide-y divide-border">
            {product.attributes.map((attr) => (
              <div key={attr.key} className="flex items-center py-2.5 gap-4">
                <dt className="w-48 text-sm text-text-secondary shrink-0">{attr.key}</dt>
                <dd className="text-sm font-medium text-text-primary">
                  {attr.value}
                  {attr.unit && <span className="text-text-secondary ml-1">{attr.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {activeTab === "variants" && (
        <Card>
          <div className="space-y-2">
            {product.variants.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{v.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums">
                    {v.price.toLocaleString("ru-RU")} ₽
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedVariant(v)}>
                    {selectedVariant.id === v.id ? (
                      <><Check size={14} className="mr-1" />Выбрано</>
                    ) : "Выбрать"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "reviews" && (
        <Card>
          <p className="text-sm text-text-secondary text-center py-8">
            Раздел отзывов — в разработке
          </p>
        </Card>
      )}

      {activeTab === "docs" && (
        <Card>
          <p className="text-sm text-text-secondary text-center py-8">
            Документация не добавлена
          </p>
        </Card>
      )}
    </div>
  );
}
