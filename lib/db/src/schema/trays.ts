import {
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { varietiesTable } from "./varieties";

export const traysTable = pgTable("trays", {
  id: integer("id").primaryKey(), // physical tray number (e.g. 214, 215…)
  varietyId: integer("variety_id")
    .notNull()
    .references(() => varietiesTable.id),
  day: integer("day").notNull(),
  totalDays: integer("total_days").notNull().default(9),
  price: integer("price").notNull(),
  // available | growing | adopted | harvested | delivered
  status: text("status").notNull().default("available"),
  adoptedBy: text("adopted_by"),
  adoptedPhone: text("adopted_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TrayRow = typeof traysTable.$inferSelect;
export type NewTray = typeof traysTable.$inferInsert;
