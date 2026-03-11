"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  Truck,
  CurrencyCircleDollar,
  CheckCircle,
  MapPin,
  Buildings,
  User,
  Phone,
  At,
  CalendarBlank,
  Warning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

// ─── Static data ────────────────────────────────────────────────────────────

const cartItems = [
  { id: "1", name: "Стол офисный СТ-120", sku: "CT-120-BK", qty: 5,  price: 12500 },
  { id: "2", name: "Кресло оператора КР-45", sku: "KR-45-GR", qty: 10, price: 8900 },
];

function formatPrice(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }

const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
const delivery  = 4500;
const total     = subtotal + delivery;

// ─── Steps ───────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2;

const STEPS = [
  { label: "Проверка заказа", icon: Package },
  { label: "Доставка", icon: Truck },
  { label: "Подтверждение", icon: CurrencyCircleDollar },
];

// ─── Step components ─────────────────────────────────────────────────────────

function StepReview() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Ваш заказ</h2>
      <div className="rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-subtle border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Товар</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wide">Кол-во</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wide">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">SKU: {item.sku}</p>
                </td>
                <td className="px-4 py-3 text-center text-text-secondary">{item.qty} шт.</td>
                <td className="px-4 py-3 text-right font-medium text-text-primary">
                  {formatPrice(item.price * item.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 p-4">
        <Warning size={18} className="shrink-0 text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-800">
          Позиция «Тумба подкатная ТП-3» временно недоступна и была убрана из заказа.
          Вы можете добавить её позже.
        </p>
      </div>
    </div>
  );
}

function StepDelivery() {
  const [deliveryType, setDeliveryType] = useState<"courier" | "pickup">("courier");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Способ доставки</h2>

      {/* Delivery type */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "courier" as const, label: "Курьерская доставка", note: "2–5 рабочих дней", price: "4 500 ₽" },
          { key: "pickup"  as const, label: "Самовывоз",           note: "Готово через 3 дня", price: "Бесплатно" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setDeliveryType(opt.key)}
            className={cn(
              "text-left rounded-[var(--radius-lg)] border-2 p-4 transition-colors",
              deliveryType === opt.key
                ? "border-primary bg-primary-light"
                : "border-border bg-surface hover:border-border-strong"
            )}
          >
            <p className={cn("font-medium text-sm", deliveryType === opt.key ? "text-primary" : "text-text-primary")}>
              {opt.label}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{opt.note}</p>
            <p className={cn("text-sm font-semibold mt-2", deliveryType === opt.key ? "text-primary" : "text-text-primary")}>
              {opt.price}
            </p>
          </button>
        ))}
      </div>

      {/* Address form */}
      {deliveryType === "courier" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Адрес доставки</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField icon={<Buildings size={16} />} label="Компания" placeholder="ООО «Название»" />
            <FormField icon={<MapPin size={16} />}    label="Город" placeholder="Москва" />
            <FormField icon={<MapPin size={16} />}    label="Улица, дом" placeholder="ул. Ленина, 45" className="col-span-2" />
            <FormField icon={<User size={16} />}      label="Контактное лицо" placeholder="Иванов Иван" />
            <FormField icon={<Phone size={16} />}     label="Телефон" placeholder="+7 (999) 000-00-00" />
            <FormField icon={<At size={16} />}        label="E-mail" placeholder="info@company.ru" className="col-span-2" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-primary">
              <CalendarBlank className="inline mr-1.5 -mt-0.5" size={14} />
              Желаемая дата доставки
            </label>
            <input
              type="date"
              className="h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {deliveryType === "pickup" && (
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 space-y-2">
          <p className="text-sm font-medium text-text-primary">Адрес склада</p>
          <p className="text-sm text-text-secondary">г. Москва, ул. Складская, 12, строение 3</p>
          <p className="text-xs text-text-tertiary">Режим работы: Пн–Пт 9:00–18:00</p>
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  icon?: React.ReactNode;
  label: string;
  placeholder?: string;
  className?: string;
}

function FormField({ icon, label, placeholder, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
        {icon && <span className="text-text-tertiary">{icon}</span>}
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="h-9 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function StepConfirm() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Подтверждение</h2>

      {/* Order summary */}
      <Card>
        <CardContent className="py-4 space-y-3 text-sm">
          <p className="font-semibold text-text-primary mb-3">Состав заказа</p>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-text-secondary">
              <span>{item.name} × {item.qty}</span>
              <span className="font-medium text-text-primary">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 space-y-1.5">
            <div className="flex justify-between text-text-secondary">
              <span>Товары ({cartItems.reduce((s, i) => s + i.qty, 0)} шт.)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Доставка</span>
              <span>{formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base text-text-primary pt-1 border-t border-border">
              <span>Итого</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery summary */}
      <Card>
        <CardContent className="py-4 space-y-1.5 text-sm">
          <p className="font-semibold text-text-primary mb-3">Доставка</p>
          <div className="flex justify-between text-text-secondary">
            <span>Способ</span><span className="text-text-primary">Курьерская доставка</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Адрес</span><span className="text-text-primary">Москва, ул. Ленина, 45</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Дата</span><span className="text-text-primary">15 марта 2026</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Контакт</span><span className="text-text-primary">Иванов Иван • +7 (999) 000-00-00</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardContent className="py-4 space-y-3 text-sm">
          <p className="font-semibold text-text-primary">Способ оплаты</p>
          <div className="grid grid-cols-2 gap-2">
            {["Счёт на оплату (банковский перевод)", "Оплата картой"].map((label, i) => (
              <label key={i} className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] border p-3 cursor-pointer transition-colors",
                i === 0 ? "border-primary bg-primary-light" : "border-border bg-surface"
              )}>
                <input type="radio" name="payment" defaultChecked={i === 0} className="accent-primary" />
                <span className={cn("text-sm", i === 0 ? "text-primary font-medium" : "text-text-secondary")}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(0);
  const [placed, setPlaced] = useState(false);
  const router = useRouter();

  const next = () => {
    if (step < 2) setStep((s) => (s + 1) as Step);
    else setPlaced(true);
  };
  const prev = () => { if (step > 0) setStep((s) => (s - 1) as Step); };

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 px-4">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={44} weight="fill" className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Заказ оформлен!</h1>
          <p className="mt-2 text-text-secondary">Заказ <span className="font-semibold">#2851</span> принят в работу.<br />Счёт на оплату будет отправлен на email.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/deals")}>Мои сделки</Button>
          <Button onClick={() => router.push("/catalog")}>Продолжить покупки</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cart">
          <button className="rounded-[var(--radius-md)] p-2 hover:bg-subtle transition-colors text-text-secondary">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Оформление заказа</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-lg)] transition-colors",
                active && "bg-primary-light",
                done   && "text-emerald-600"
              )}>
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  active && "border-primary bg-primary text-white",
                  done   && "border-emerald-500 bg-emerald-500 text-white",
                  !active && !done && "border-border text-text-tertiary"
                )}>
                  {done ? <Check size={14} weight="bold" /> : i + 1}
                </div>
                <span className={cn(
                  "text-sm font-medium hidden sm:block",
                  active && "text-primary",
                  done   && "text-emerald-600",
                  !active && !done && "text-text-tertiary"
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2 rounded-full transition-colors", i < step ? "bg-emerald-400" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step content */}
        <div className="lg:col-span-2 space-y-4">
          {step === 0 && <StepReview />}
          {step === 1 && <StepDelivery />}
          {step === 2 && <StepConfirm />}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={prev} disabled={step === 0}>
              <ArrowLeft size={16} />
              Назад
            </Button>
            <Button onClick={next}>
              {step === 2 ? (
                <>Оформить заказ <Check size={16} /></>
              ) : (
                <>Далее <ArrowRight size={16} /></>
              )}
            </Button>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="py-4 space-y-3 text-sm">
              <p className="font-semibold text-text-primary">Итог заказа</p>
              <div className="space-y-1.5 text-text-secondary">
                <div className="flex justify-between">
                  <span>Товары ({cartItems.reduce((s, i) => s + i.qty, 0)} шт.)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span>{formatPrice(delivery)}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-text-primary text-base">
                <span>Итого</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="py-4">
              <p className="text-xs font-medium text-text-secondary mb-2">
                Шаг {step + 1} из {STEPS.length}
              </p>
              <Progress value={((step + 1) / STEPS.length) * 100} color="primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
