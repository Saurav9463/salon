import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/services", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(servicesTable.category, servicesTable.name);
    res.json(services);
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { name, category, description, duration_minutes, price, active = true } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "name and category are required" });
    }
    const [service] = await db.insert(servicesTable).values({
      name, category, description, duration_minutes, price, active
    }).returning();
    res.status(201).json(service);
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    res.status(500).json({ error: "Failed to create service" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, req.params.id));
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    req.log.error({ err }, "Failed to get service");
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

router.patch("/services/:id", async (req, res) => {
  try {
    const { name, category, description, duration_minutes, price, active } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;
    if (price !== undefined) updates.price = price;
    if (active !== undefined) updates.active = active;
    const [service] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, req.params.id)).returning();
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    req.log.error({ err }, "Failed to update service");
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    await db.delete(servicesTable).where(eq(servicesTable.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete service");
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
