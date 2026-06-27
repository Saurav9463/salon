import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, servicesTable, teamTable, messagesTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await db
      .select({
        id: bookingsTable.id,
        client_name: bookingsTable.client_name,
        client_email: bookingsTable.client_email,
        client_phone: bookingsTable.client_phone,
        service_id: bookingsTable.service_id,
        stylist_id: bookingsTable.stylist_id,
        appointment_date: bookingsTable.appointment_date,
        appointment_time: bookingsTable.appointment_time,
        status: bookingsTable.status,
        created_at: bookingsTable.created_at,
        service_name: servicesTable.name,
        stylist_name: teamTable.name,
      })
      .from(bookingsTable)
      .leftJoin(servicesTable, eq(bookingsTable.service_id, servicesTable.id))
      .leftJoin(teamTable, eq(bookingsTable.stylist_id, teamTable.id))
      .orderBy(bookingsTable.created_at);
    res.json(bookings);
  } catch (err) {
    req.log.error({ err }, "Failed to list bookings");
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const { client_name, client_email, client_phone, service_id, stylist_id, appointment_date, appointment_time } = req.body;
    if (!client_name) {
      return res.status(400).json({ error: "client_name is required" });
    }
    const [booking] = await db.insert(bookingsTable).values({
      client_name, client_email, client_phone, service_id, stylist_id, appointment_date, appointment_time, status: "pending"
    }).returning();
    res.status(201).json(booking);
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status.toLowerCase();
    const [booking] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, req.params.id)).returning();
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    req.log.error({ err }, "Failed to update booking");
    res.status(500).json({ error: "Failed to update booking" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete booking");
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalBookings] = await db.select({ value: count() }).from(bookingsTable);
    const [pendingBookings] = await db.select({ value: count() }).from(bookingsTable).where(sql`lower(${bookingsTable.status}) = 'pending'`);
    const [confirmedBookings] = await db.select({ value: count() }).from(bookingsTable).where(sql`lower(${bookingsTable.status}) = 'confirmed'`);
    const [unreadMessages] = await db.select({ value: count() }).from(messagesTable).where(eq(messagesTable.read, false));
    const [totalServices] = await db.select({ value: count() }).from(servicesTable);
    const [totalTeam] = await db.select({ value: count() }).from(teamTable);

    res.json({
      total_bookings: Number(totalBookings?.value ?? 0),
      pending_bookings: Number(pendingBookings?.value ?? 0),
      confirmed_bookings: Number(confirmedBookings?.value ?? 0),
      unread_messages: Number(unreadMessages?.value ?? 0),
      total_services: Number(totalServices?.value ?? 0),
      total_team: Number(totalTeam?.value ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
