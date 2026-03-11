import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  inn: text("inn"),
  ogrn: text("ogrn"),
  legalAddress: text("legal_address"),
  actualAddress: text("actual_address"),
  description: text("description"),
  region: text("region"),
  profileCompletePct: text("profile_complete_pct").default("0"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tenantSpecializations = pgTable("tenant_specializations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});
