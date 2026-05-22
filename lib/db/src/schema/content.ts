import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tutorsTable } from "./tutors";
import { playlistsTable } from "./playlists";

export const contentTable = pgTable("content", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull().references(() => tutorsTable.id, { onDelete: "cascade" }),
  playlistId: integer("playlist_id").notNull().references(() => playlistsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(contentTable).omit({ id: true, createdAt: true });
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contentTable.$inferSelect;
