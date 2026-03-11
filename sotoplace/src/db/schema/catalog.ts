import { pgTable, text, timestamp, uuid, integer, numeric, boolean, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const productTypeEnum = pgEnum("product_type", ["product", "service", "capacity"]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id"),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  categoryId: uuid("category_id").references(() => categories.id),
  type: productTypeEnum("type").notNull().default("product"),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RUB"),
  unit: text("unit").notNull().default("шт"),
  stock: integer("stock").default(0),
  leadTimeDays: integer("lead_time_days").default(0),
  isPublished: boolean("is_published").default(true).notNull(),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  position: integer("position").default(0),
});

export const productAttributes = pgTable("product_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku"),
  price: numeric("price", { precision: 12, scale: 2 }),
  stock: integer("stock").default(0),
});
