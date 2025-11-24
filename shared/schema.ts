import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const demolitions = pgTable("demolitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyAddress: text("property_address").notNull(),
  demolitionDate: timestamp("demolition_date", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("pending"),
  imageUrl: text("image_url"),
  extractedText: text("extracted_text"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const insertDemolitionSchema = createInsertSchema(demolitions).omit({
  id: true,
  createdAt: true,
}).extend({
  demolitionDate: z.string(),
});

export type InsertDemolition = z.infer<typeof insertDemolitionSchema>;
export type Demolition = typeof demolitions.$inferSelect;
