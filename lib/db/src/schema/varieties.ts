import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const varietiesTable = pgTable("varieties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // 'tall' | 'short' | 'premium'
  character: text("character").notNull(),
  priceBase: integer("price_base").notNull(),
  nutrients: jsonb("nutrients").notNull().$type<string[]>(),
  nutrientNote: text("nutrient_note").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Variety = typeof varietiesTable.$inferSelect;
export type NewVariety = typeof varietiesTable.$inferInsert;
