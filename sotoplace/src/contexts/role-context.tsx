"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { USERS, type UserRole } from "@/lib/mock-data";

interface RoleContextValue {
  role: UserRole;
  setRole: (r: UserRole) => void;
  user: typeof USERS[UserRole];
}

const RoleContext = createContext<RoleContextValue>({
  role: "manager",
  setRole: () => {},
  user: USERS.manager,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("manager");

  useEffect(() => {
    const saved = localStorage.getItem("sotoplace_role") as UserRole | null;
    if (saved && saved in USERS) setRoleState(saved);
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    localStorage.setItem("sotoplace_role", r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, user: USERS[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
