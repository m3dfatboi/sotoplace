import { pgTable, text, timestamp, uuid, numeric, boolean, integer } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const counterpartyRelations = pgTable("counterparty_relations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),       // кто видит
  targetTenantId: uuid("target_tenant_id").notNull().references(() => tenants.id), // кого видит
  isFavorite: boolean("is_favorite").default(false),
  contactsRevealed: boolean("contacts_revealed").default(false),
  revealedAt: timestamp("revealed_at"),
  firstDealId: uuid("first_deal_id"),
  dealsCount: integer("deals_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tenantReviews = pgTable("tenant_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorTenantId: uuid("author_tenant_id").notNull().references(() => tenants.id),
  targetTenantId: uuid("target_tenant_id").notNull().references(() => tenants.id),
  dealId: uuid("deal_id"),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  productId: uuid("product_id").notNull(),
  variantId: uuid("variant_id"),
  qty: integer("qty").notNull().default(1),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});
