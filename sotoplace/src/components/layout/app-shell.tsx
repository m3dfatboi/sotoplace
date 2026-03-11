"use client";

import { useState, type ReactNode } from "react";
import { SidebarContext } from "@/hooks/use-sidebar";
import { RoleProvider } from "@/contexts/role-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileTabBar } from "./mobile-tab-bar";
import { cn } from "@/lib/cn";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleProvider>
      <SidebarContext.Provider
        value={{
          collapsed,
          mobileOpen,
          toggle: () => setCollapsed((prev) => !prev),
          setMobileOpen,
        }}
      >
        <div className="min-h-screen bg-background">
          <Sidebar />
          <div
            className={cn(
              "flex flex-col transition-all duration-[var(--duration-normal)]",
              "lg:ml-[var(--sidebar-expanded)]",
              collapsed && "lg:ml-[var(--sidebar-collapsed)]"
            )}
          >
            <Topbar />
            <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
              <div className="mx-auto max-w-[1392px]">{children}</div>
            </main>
          </div>
          <MobileTabBar />
        </div>
      </SidebarContext.Provider>
    </RoleProvider>
  );
}
