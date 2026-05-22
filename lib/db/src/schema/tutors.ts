import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tutorsTable = pgTable("tutors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profession: text("profession"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTutorSchema = createInsertSchema(tutorsTable).omit({ id: true, createdAt: true });
export type InsertTutor = z.infer<typeof insertTutorSchema>;
export type Tutor = typeof tutorsTable.$inferSelect;
