import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";

const router = Router();

router.get("/settings", async (req, res) => {
  try {
    const settings = await db.select().from(settingsTable).orderBy(settingsTable.key);
    res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Failed to list settings");
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { settings } = req.body as { settings: { key: string; value: string }[] };
    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: "settings array is required" });
    }
    const results = [];
    for (const { key, value } of settings) {
      const [s] = await db
        .insert(settingsTable)
        .values({ key, value })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value } })
        .returning();
      results.push(s);
    }
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to upsert settings");
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
