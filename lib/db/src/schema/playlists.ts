import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tutorsTable } from "./tutors";

export const playlistsTable = pgTable("playlists", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull().references(() => tutorsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlistsTable).omit({ id: true, createdAt: true });
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlistsTable.$inferSelect;
