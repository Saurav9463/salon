import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await db.select().from(messagesTable).orderBy(messagesTable.created_at);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }
    const [msg] = await db.insert(messagesTable).values({ name, email, message }).returning();
    res.status(201).json(msg);
  } catch (err) {
    req.log.error({ err }, "Failed to create message");
    res.status(500).json({ error: "Failed to create message" });
  }
});

router.patch("/messages/:id", async (req, res) => {
  try {
    const { read } = req.body;
    const updates: Record<string, unknown> = {};
    if (read !== undefined) updates.read = read;
    const [msg] = await db.update(messagesTable).set(updates).where(eq(messagesTable.id, req.params.id)).returning();
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json(msg);
  } catch (err) {
    req.log.error({ err }, "Failed to update message");
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    await db.delete(messagesTable).where(eq(messagesTable.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete message");
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
