import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contentTable } from "./content";

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => contentTable.id, { onDelete: "cascade" }),
  userId: integer("user_id"),
  tutorId: integer("tutor_id"),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(commentsTable).omit({ id: true, createdAt: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof commentsTable.$inferSelect;
