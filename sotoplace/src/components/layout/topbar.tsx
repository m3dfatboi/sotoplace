"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  List,
  MagnifyingGlass,
  Bell,
  Plus,
  House,
  Receipt,
  Package,
  Ruler,
  Buildings,
  Gear,
  ShoppingCart,
  ChatCircle,
  UserCircle,
  PencilRuler,
  Shield,
} from "@phosphor-icons/react";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";

const commandItems: CommandItem[] = [
  // Навигация
  { id: "nav-dashboard",       group: "Навигация", icon: <House size={16} />,         label: "Главная (менеджер)",     action: () => {} },
  { id: "nav-dashboard-cons",  group: "Навигация", icon: <PencilRuler size={16} />,   label: "Главная (конструктор)",  action: () => {} },
  { id: "nav-dashboard-client",group: "Навигация", icon: <UserCircle size={16} />,    label: "Главная (клиент)",       action: () => {} },
  { id: "nav-dashboard-admin", group: "Навигация", icon: <Shield size={16} />,        label: "Главная (администратор)",action: () => {} },
  { id: "nav-catalog",         group: "Навигация", icon: <Package size={16} />,       label: "Каталог",                shortcut: [], action: () => {} },
  { id: "nav-deals",           group: "Навигация", icon: <Receipt size={16} />,       label: "Сделки",                 action: () => {} },
  { id: "nav-cart",            group: "Навигация", icon: <ShoppingCart size={16} />,  label: "Корзина",                action: () => {} },
  { id: "nav-engineering",     group: "Навигация", icon: <Ruler size={16} />,         label: "Инжиниринг",             action: () => {} },
  { id: "nav-counterparties",  group: "Навигация", icon: <Buildings size={16} />,     label: "Контрагенты",            action: () => {} },
  { id: "nav-messages",        group: "Навигация", icon: <ChatCircle size={16} />,    label: "Сообщения",              action: () => {} },
  { id: "nav-settings",        group: "Навигация", icon: <Gear size={16} />,          label: "Настройки",              action: () => {} },
  // Быстрые действия
  { id: "act-new-deal",    group: "Действия", icon: <Plus size={16} />, label: "Создать сделку",    description: "Новая сделка", action: () => {} },
  { id: "act-checkout",    group: "Действия", icon: <ShoppingCart size={16} />, label: "Оформить заказ", description: "Перейти в корзину", action: () => {} },
];

export function Topbar() {
  const { toggle, setMobileOpen } = useSidebar();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);

  // Resolve actions with router
  const items: CommandItem[] = commandItems.map((item) => {
    const routes: Record<string, string> = {
      "nav-dashboard":        "/dashboard",
      "nav-dashboard-cons":   "/dashboard/designer",
      "nav-dashboard-client": "/dashboard/client",
      "nav-dashboard-admin":  "/dashboard/admin",
      "nav-catalog":          "/catalog",
      "nav-deals":            "/deals",
      "nav-cart":             "/cart",
      "nav-engineering":      "/engineering",
      "nav-counterparties":   "/counterparties",
      "nav-messages":         "/messages",
      "nav-settings":         "/settings",
      "act-new-deal":         "/deals",
      "act-checkout":         "/cart/checkout",
    };
    return { ...item, action: () => router.push(routes[item.id] ?? "/") };
  });

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[var(--topbar-height)] items-center gap-3 border-b border-border bg-surface/95 backdrop-blur-sm px-4">
        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-subtle transition-colors lg:hidden"
          aria-label="Открыть меню"
        >
          <List size={20} />
        </button>

        {/* Sidebar toggle (desktop) */}
        <button
          onClick={toggle}
          className="hidden lg:flex p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-subtle transition-colors"
          aria-label="Свернуть/развернуть боковую панель"
        >
          <List size={20} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search / command palette trigger */}
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-subtle px-3 py-1.5 text-sm text-text-tertiary hover:bg-muted transition-colors"
          aria-label="Поиск (⌘K)"
        >
          <MagnifyingGlass size={16} />
          <span className="hidden sm:inline">Поиск...</span>
          <kbd className="hidden sm:inline ml-2 rounded-[var(--radius-sm)] border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-subtle transition-colors"
          aria-label="Уведомления"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Quick actions */}
        <button
          onClick={() => router.push("/deals?new=1")}
          className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-xs"
          aria-label="Создать сделку"
        >
          <Plus size={16} weight="bold" />
          <span className="hidden sm:inline">Создать</span>
        </button>
      </header>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        items={items}
        placeholder="Поиск по разделам и действиям..."
      />
    </>
  );
}
