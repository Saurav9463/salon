import { Router } from "express";
import { db } from "@workspace/db";
import { teamTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/team", async (req, res) => {
  try {
    const members = await db.select().from(teamTable).orderBy(teamTable.name);
    res.json(members);
  } catch (err) {
    req.log.error({ err }, "Failed to list team");
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

router.post("/team", async (req, res) => {
  try {
    const { name, role, bio, speciality, photo_url, years_experience, active = true } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: "name and role are required" });
    }
    const [member] = await db.insert(teamTable).values({
      name, role, bio, speciality, photo_url, years_experience, active
    }).returning();
    res.status(201).json(member);
  } catch (err) {
    req.log.error({ err }, "Failed to create team member");
    res.status(500).json({ error: "Failed to create team member" });
  }
});

router.patch("/team/:id", async (req, res) => {
  try {
    const { name, role, bio, speciality, photo_url, years_experience, active } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (bio !== undefined) updates.bio = bio;
    if (speciality !== undefined) updates.speciality = speciality;
    if (photo_url !== undefined) updates.photo_url = photo_url;
    if (years_experience !== undefined) updates.years_experience = years_experience;
    if (active !== undefined) updates.active = active;
    const [member] = await db.update(teamTable).set(updates).where(eq(teamTable.id, req.params.id)).returning();
    if (!member) return res.status(404).json({ error: "Team member not found" });
    res.json(member);
  } catch (err) {
    req.log.error({ err }, "Failed to update team member");
    res.status(500).json({ error: "Failed to update team member" });
  }
});

router.delete("/team/:id", async (req, res) => {
  try {
    await db.delete(teamTable).where(eq(teamTable.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete team member");
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
