import { Router, type IRouter } from "express";
import { db, bulkInquiriesTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/bulk-inquiries", async (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  const { name, quantity, occasion, phone } = req.body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const [row] = await db
      .insert(bulkInquiriesTable)
      .values({
        name: name.trim(),
        quantity: quantity?.trim() || null,
        occasion: occasion?.trim() || null,
        phone: phone?.trim() || null,
      })
      .returning({ id: bulkInquiriesTable.id });

    logger.info({ id: row.id, name }, "Bulk inquiry received");
    res.status(201).json({ id: row.id });
  } catch (err) {
    logger.error({ err }, "Failed to save bulk inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
