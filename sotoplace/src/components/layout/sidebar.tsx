"use client";

import { cn } from "@/lib/cn";
import { useSidebar } from "@/hooks/use-sidebar";
import { useRole } from "@/contexts/role-context";
import { Avatar } from "@/components/ui/avatar";
import { USERS, type UserRole } from "@/lib/mock-data";
import {
  House, Package, ShoppingCart, Receipt, Ruler,
  Buildings, ChatCircle, Gear, X,
  PencilRuler, UserCircle, Shield, CaretUpDown,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[] | "all";
}

const navItems: NavItem[] = [
  { label: "Главная",      href: "/dashboard",      icon: House,        roles: "all" },
  { label: "Каталог",      href: "/catalog",         icon: Package,      roles: "all" },
  { label: "Корзина",      href: "/cart",            icon: ShoppingCart, roles: ["manager", "client"] },
  { label: "Сделки",       href: "/deals",           icon: Receipt,      badge: 7,  roles: "all" },
  { label: "Инжиниринг",   href: "/engineering",     icon: Ruler,        badge: 3,  roles: ["manager", "constructor", "admin"] },
  { label: "Контрагенты",  href: "/counterparties",  icon: Buildings,    roles: ["manager", "admin"] },
  { label: "Сообщения",    href: "/messages",        icon: ChatCircle,   badge: 2,  roles: "all" },
];

const dashboardsByRole: Record<UserRole, { href: string; icon: React.ElementType; label: string }> = {
  manager:     { href: "/dashboard",             icon: House,        label: "Дашборд" },
  constructor: { href: "/dashboard/designer", icon: PencilRuler,  label: "Рабочий стол" },
  client:      { href: "/dashboard/client",      icon: UserCircle,   label: "Мои заказы" },
  admin:       { href: "/dashboard/admin",       icon: Shield,       label: "Администратор" },
};

const roleLabels: Record<UserRole, string> = {
  manager:     "Менеджер",
  constructor: "Конструктор",
  client:      "Клиент",
  admin:       "Администратор",
};

const roleColors: Record<UserRole, string> = {
  manager:     "bg-blue-100 text-blue-700",
  constructor: "bg-purple-100 text-purple-700",
  client:      "bg-emerald-100 text-emerald-700",
  admin:       "bg-orange-100 text-orange-700",
};

export function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { role, setRole, user } = useRole();
  const pathname = usePathname();
  const router = useRouter();
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  const dashboardLink = dashboardsByRole[role];
  const filteredItems = navItems.filter(
    (item) => item.roles === "all" || item.roles.includes(role)
  );

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setRolePickerOpen(false);
    router.push(dashboardsByRole[newRole].href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-4 border-b border-border", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-primary text-white text-sm font-bold shrink-0">
          S
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Sotoplace</p>
            <p className="text-xs text-text-tertiary truncate">{user.company}</p>
          </div>
        )}
      </div>

      {/* Role switcher */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-border relative">
          <button
            onClick={() => setRolePickerOpen((p) => !p)}
            className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-subtle transition-colors"
          >
            <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-semibold", roleColors[role])}>
              {roleLabels[role]}
            </span>
            <span className="flex-1 text-left text-sm font-medium text-text-primary truncate">{user.name}</span>
            <CaretUpDown size={14} className="shrink-0 text-text-tertiary" />
          </button>

          {rolePickerOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl overflow-hidden">
              <div className="p-2 border-b border-border">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary px-2">
                  Переключить роль
                </p>
              </div>
              {(Object.keys(USERS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-subtle",
                    r === role && "bg-primary-light"
                  )}
                >
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold shrink-0", roleColors[r])}>
                    {roleLabels[r].slice(0, 3)}
                  </span>
                  <div className="text-left min-w-0">
                    <p className={cn("font-medium", r === role ? "text-primary" : "text-text-primary")}>
                      {USERS[r].name}
                    </p>
                    <p className="text-[11px] text-text-tertiary">{roleLabels[r]}</p>
                  </div>
                  {r === role && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-0.5">
          {filteredItems.map((item) => {
            const href = item.href === "/dashboard" ? dashboardLink.href : item.href;
            const Icon = item.href === "/dashboard" ? dashboardLink.icon : item.icon;
            const label = item.href === "/dashboard" ? dashboardLink.label : item.label;
            const isActive = item.href === "/dashboard"
              ? pathname.startsWith(dashboardLink.href)
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={href}
                  onClick={() => { setMobileOpen(false); setRolePickerOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors hover:bg-subtle",
                    isActive
                      ? "bg-primary-light text-primary border-l-[3px] border-primary"
                      : "text-text-secondary hover:text-text-primary",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {item.badge != null && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-2 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-subtle transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <Gear size={20} className="shrink-0" />
          {!collapsed && <span>Настройки</span>}
        </Link>
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2">
            <Avatar initials={user.initials} size="sm" online />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-[11px] text-text-tertiary">{roleLabels[role]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-surface border-r border-border transition-all duration-[var(--duration-normal)]",
        collapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-expanded)]"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-surface border-r border-border transition-transform duration-[var(--duration-normal)] lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-end px-4 py-2">
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-subtle transition-colors">
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
