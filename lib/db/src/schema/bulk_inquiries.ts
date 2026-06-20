import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bulkInquiriesTable = pgTable("bulk_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  occasion: text("occasion"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BulkInquiryRow = typeof bulkInquiriesTable.$inferSelect;
export type NewBulkInquiry = typeof bulkInquiriesTable.$inferInsert;
