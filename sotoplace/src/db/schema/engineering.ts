import { pgTable, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { deals } from "./deals";
import { dealPositions } from "./deals";

export const drawingStatusEnum = pgEnum("drawing_status", [
  "draft",       // Черновик
  "in_review",   // На внутренней проверке
  "sent",        // Отправлено клиенту
  "approved",    // Согласовано клиентом
  "rejected",    // Отклонено
  "rework",      // На доработке
]);

export const drawings = pgTable("drawings", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").notNull().references(() => deals.id),
  positionId: uuid("position_id").references(() => dealPositions.id),
  name: text("name").notNull(),
  currentVersion: integer("current_version").notNull().default(1),
  status: drawingStatusEnum("status").notNull().default("draft"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const drawingVersions = pgTable("drawing_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  drawingId: uuid("drawing_id").notNull().references(() => drawings.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSizeBytes: integer("file_size_bytes"),
  mimeType: text("mime_type"),
  uploadedBy: uuid("uploaded_by").notNull().references(() => users.id),
  status: drawingStatusEnum("status").notNull().default("draft"),
  rejectionReason: text("rejection_reason"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const drawingComments = pgTable("drawing_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  drawingId: uuid("drawing_id").notNull().references(() => drawings.id, { onDelete: "cascade" }),
  versionId: uuid("version_id").references(() => drawingVersions.id),
  authorId: uuid("author_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at"),
});
