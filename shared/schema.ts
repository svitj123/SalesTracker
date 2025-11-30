import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  agent: text("agent"),
  lokacija: text("lokacija").notNull(),
  obiskani: integer("obiskani").notNull(),
  odzvani: integer("odzvani").notNull(),
  fix: integer("fix").notNull(),
  mob: integer("mob").notNull(),
  vs: integer("vs").notNull(),
  tw: integer("tw").notNull(),
  ure: doublePrecision("ure").notNull(),
  priimki: text("priimki").array().notNull(),
  raw_text: text("raw_text").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true,
  created_at: true 
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
