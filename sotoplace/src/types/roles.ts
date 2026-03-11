export type UserRole = "manager" | "constructor" | "client" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  roles: UserRole[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: "Менеджер",
  constructor: "Конструктор",
  client: "Клиент",
  admin: "Администратор",
};
