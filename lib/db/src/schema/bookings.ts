import { pgTable, text, uuid, date, time, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  client_name: text("client_name").notNull(),
  client_email: text("client_email"),
  client_phone: text("client_phone"),
  service_id: uuid("service_id"),
  stylist_id: uuid("stylist_id"),
  appointment_date: date("appointment_date"),
  appointment_time: time("appointment_time"),
  status: text("status").default("Pending").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, created_at: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
