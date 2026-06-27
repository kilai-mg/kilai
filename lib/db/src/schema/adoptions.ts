import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { traysTable } from "./trays";

export const adoptionsTable = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  trayId: integer("tray_id").notNull().references(() => traysTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  wantTrayAddon: boolean("want_tray_addon").notNull().default(false),
  wantGuideAddon: boolean("want_guide_addon").notNull().default(false),
  totalRupees: integer("total_rupees").notNull(),
  status: text("status").notNull().default("pending"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AdoptionRow = typeof adoptionsTable.$inferSelect;
export type NewAdoption = typeof adoptionsTable.$inferInsert;
