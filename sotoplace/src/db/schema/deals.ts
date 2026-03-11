import { pgTable, text, timestamp, uuid, integer, numeric, boolean, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";
import { products } from "./catalog";

export const dealStatusEnum = pgEnum("deal_status", [
  "draft",         // Черновик
  "proposal_sent", // КП отправлено
  "approved",      // Согласовано
  "in_production", // В производстве
  "ready",         // Готово к отгрузке
  "shipped",       // Отгружено
  "closed",        // Закрыто
  "cancelled",     // Отменено
]);

export const operationStatusEnum = pgEnum("operation_status", [
  "pending",
  "in_progress",
  "done",
]);

export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: text("number").notNull().unique(), // "#2847"
  sellerTenantId: uuid("seller_tenant_id").notNull().references(() => tenants.id),
  buyerTenantId: uuid("buyer_tenant_id").references(() => tenants.id),
  assignedManagerId: uuid("assigned_manager_id").references(() => users.id),
  status: dealStatusEnum("status").notNull().default("draft"),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }),
  purchaseAmount: numeric("purchase_amount", { precision: 14, scale: 2 }), // internal
  currency: text("currency").default("RUB"),
  notes: text("notes"),
  slaDeadline: timestamp("sla_deadline"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dealPositions = pgTable("deal_positions", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id),
  name: text("name").notNull(),
  sku: text("sku"),
  qty: integer("qty").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 14, scale: 2 }).notNull(),
  position: integer("position").default(0),
});

// Деталь позиции (каркас, столешница и т.д.)
export const dealParts = pgTable("deal_parts", {
  id: uuid("id").primaryKey().defaultRandom(),
  positionId: uuid("position_id").notNull().references(() => dealPositions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  qty: integer("qty").notNull().default(1),
  contractorTenantId: uuid("contractor_tenant_id").references(() => tenants.id),
  purchasePricePerUnit: numeric("purchase_price_per_unit", { precision: 12, scale: 2 }),
  subDealId: uuid("sub_deal_id"), // ref to deals.id — added as FK below
});

// Операции ТР/ОК/УП/СК/СБ на уровне детали
export const operationTypeEnum = pgEnum("operation_type", ["TR", "OK", "UP", "SK", "SB"]);

export const partOperations = pgTable("part_operations", {
  id: uuid("id").primaryKey().defaultRandom(),
  partId: uuid("part_id").notNull().references(() => dealParts.id, { onDelete: "cascade" }),
  type: operationTypeEnum("type").notNull(),
  status: operationStatusEnum("status").notNull().default("pending"),
  doneAt: timestamp("done_at"),
  doneBy: uuid("done_by").references(() => users.id),
  notes: text("notes"),
});

// Payments
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "partial", "paid", "overdue",
]);

export const dealPayments = pgTable("deal_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").notNull().references(() => deals.id),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  dueAt: timestamp("due_at"),
  paidAt: timestamp("paid_at"),
  invoiceUrl: text("invoice_url"),
  notes: text("notes"),
});
