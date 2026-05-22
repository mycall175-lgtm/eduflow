import { pgTable, serial, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contentTable } from "./content";

export const likesTable = pgTable("likes", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => contentTable.id, { onDelete: "cascade" }),
  userId: integer("user_id"),
  tutorId: integer("tutor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("unique_user_like").on(t.contentId, t.userId),
]);

export const insertLikeSchema = createInsertSchema(likesTable).omit({ id: true, createdAt: true });
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likesTable.$inferSelect;
