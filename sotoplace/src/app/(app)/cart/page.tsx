"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Warning,
} from "@phosphor-icons/react";

const initialItems = [
  { id: "1", name: "Стол офисный СТ-120",    sku: "CT-120-BK", vendor: "МеталлПро",  price: 12500, qty: 5,  available: true  },
  { id: "2", name: "Кресло оператора КР-45",  sku: "KR-45-GR",  vendor: "МеталлПро",  price: 8900,  qty: 10, available: true  },
  { id: "3", name: "Тумба подкатная ТП-3",    sku: "TP-3-BK",   vendor: "Полка Про",  price: 9200,  qty: 1,  available: false },
];

function formatPrice(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const changeQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">
          Корзина <span className="text-text-secondary font-normal text-lg">({items.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-[var(--radius-md)] bg-subtle flex items-center justify-center shrink-0">
                <span className="text-2xl text-text-tertiary/30 font-bold">{item.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                <p className="text-xs text-text-tertiary"><span className="font-mono">{item.sku}</span> · {item.vendor}</p>
                {!item.available && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-warning-700)]">
                    <Warning size={12} weight="fill" />
                    Нет в наличии — под заказ (+5 дней)
                  </div>
                )}
                <p className="text-sm font-medium font-mono tabular-nums">{formatPrice(item.price)} / шт</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-0 border border-border rounded-[var(--radius-md)] overflow-hidden">
                  <button onClick={() => changeQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-subtle transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums border-x border-border bg-surface">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, +1)} className="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-subtle transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold font-mono tabular-nums">{formatPrice(item.price * item.qty)}</p>
                <button onClick={() => remove(item.id)} className="text-text-tertiary hover:text-danger transition-colors p-1">
                  <Trash size={16} />
                </button>
              </div>
            </Card>
          ))}

          <Link href="/catalog">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={14} className="mr-1.5" />
              Продолжить покупки
            </Button>
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-[calc(var(--topbar-height)+24px)] space-y-4">
            <h3 className="text-base font-semibold">Итого</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Товаров</span>
                <span>{items.length} позиции ({totalItems} шт)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Сумма</span>
                <span className="font-mono tabular-nums">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-text-tertiary">
                <span>Доставка</span>
                <span>рассчитывается при оформлении</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-base font-semibold">Итого к оплате</span>
              <span className="text-lg font-bold font-mono tabular-nums">{formatPrice(totalPrice)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => router.push("/cart/checkout")}>
              <Truck size={16} className="mr-2" />
              Оформить заказ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
