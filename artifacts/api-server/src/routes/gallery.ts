import { Router } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/gallery", async (req, res) => {
  try {
    const images = await db.select().from(galleryTable).orderBy(galleryTable.created_at);
    res.json(images);
  } catch (err) {
    req.log.error({ err }, "Failed to list gallery");
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.post("/gallery", async (req, res) => {
  try {
    const { image_url, category } = req.body;
    if (!image_url || !category) {
      return res.status(400).json({ error: "image_url and category are required" });
    }
    const [image] = await db.insert(galleryTable).values({ image_url, category }).returning();
    res.status(201).json(image);
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery image");
    res.status(500).json({ error: "Failed to create gallery image" });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    await db.delete(galleryTable).where(eq(galleryTable.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery image");
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

export default router;
