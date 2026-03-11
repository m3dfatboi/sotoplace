"use client";

import { cn } from "@/lib/cn";
import {
  House,
  Package,
  Receipt,
  ChatCircle,
  DotsThree,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Главная", href: "/dashboard", icon: House },
  { label: "Каталог", href: "/catalog", icon: Package },
  { label: "Сделки", href: "/deals", icon: Receipt },
  { label: "Чат", href: "/messages", icon: ChatCircle },
  { label: "Ещё", href: "#more", icon: DotsThree },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm lg:hidden safe-area-pb">
      <div className="flex items-center justify-around py-1">
        {tabs.map((tab) => {
          const isActive = tab.href !== "#more" && pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-text-tertiary"
              )}
            >
              <Icon size={22} weight={isActive ? "fill" : "regular"} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
