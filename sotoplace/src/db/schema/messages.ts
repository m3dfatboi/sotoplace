import { pgTable, text, timestamp, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { deals } from "./deals";
import { drawings } from "./engineering";
import { tenants } from "./tenants";

export const chatTypeEnum = pgEnum("chat_type", [
  "deal",     // Чат по сделке
  "drawing",  // Чат по чертежу
  "general",  // Общий чат между компаниями
]);

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: chatTypeEnum("type").notNull(),
  dealId: uuid("deal_id").references(() => deals.id),
  drawingId: uuid("drawing_id").references(() => drawings.id),
  tenantAId: uuid("tenant_a_id").notNull().references(() => tenants.id),
  tenantBId: uuid("tenant_b_id").references(() => tenants.id),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  text: text("text"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  isRead: boolean("is_read").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageReads = pgTable("message_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  readAt: timestamp("read_at").defaultNow().notNull(),
});
