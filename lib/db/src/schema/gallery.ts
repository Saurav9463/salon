import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryTable = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  image_url: text("image_url").notNull(),
  category: text("category").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, created_at: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type GalleryImage = typeof galleryTable.$inferSelect;
