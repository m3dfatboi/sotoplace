"use client";

import { createContext, useContext } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  toggle: () => {},
  setMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}
