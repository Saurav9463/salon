import { pgTable, text, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const teamTable = pgTable("team", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  speciality: text("speciality"),
  photo_url: text("photo_url"),
  years_experience: integer("years_experience"),
  active: boolean("active").default(true).notNull(),
});

export const insertTeamSchema = createInsertSchema(teamTable).omit({ id: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamTable.$inferSelect;
