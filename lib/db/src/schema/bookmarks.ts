import { pgTable, serial, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { playlistsTable } from "./playlists";

export const bookmarksTable = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  playlistId: integer("playlist_id").notNull().references(() => playlistsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("unique_user_bookmark").on(t.userId, t.playlistId),
]);

export const insertBookmarkSchema = createInsertSchema(bookmarksTable).omit({ id: true, createdAt: true });
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarksTable.$inferSelect;
