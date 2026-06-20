import { Router, type IRouter } from "express";
import { db, adoptionsTable, traysTable, varietiesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ADDON_TRAY_PRICE  = 349;
const ADDON_GUIDE_PRICE = 199;

router.post("/adoptions", async (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  const { varietyName, customerName, customerPhone, wantTrayAddon = false, wantGuideAddon = false } = req.body ?? {};

  if (!varietyName || typeof varietyName !== "string") {
    res.status(400).json({ error: "varietyName is required" });
    return;
  }
  if (!customerName || typeof customerName !== "string") {
    res.status(400).json({ error: "customerName is required" });
    return;
  }
  if (!customerPhone || typeof customerPhone !== "string") {
    res.status(400).json({ error: "customerPhone is required" });
    return;
  }

  try {
    // Resolve variety
    const [variety] = await db
      .select({ id: varietiesTable.id, priceBase: varietiesTable.priceBase })
      .from(varietiesTable)
      .where(eq(varietiesTable.name, varietyName))
      .limit(1);

    if (!variety) {
      res.status(409).json({ error: `No variety found: ${varietyName}` });
      return;
    }

    // Find next available tray for this variety
    const [tray] = await db
      .select({ id: traysTable.id, price: traysTable.price })
      .from(traysTable)
      .where(and(eq(traysTable.varietyId, variety.id), eq(traysTable.status, "available")))
      .limit(1);

    if (!tray) {
      res.status(409).json({ error: `No available tray for ${varietyName}` });
      return;
    }

    const totalRupees =
      tray.price +
      (wantTrayAddon  ? ADDON_TRAY_PRICE  : 0) +
      (wantGuideAddon ? ADDON_GUIDE_PRICE : 0);

    // Mark tray adopted + create adoption record in a transaction
    const [adoption] = await db.transaction(async (tx) => {
      await tx
        .update(traysTable)
        .set({ status: "adopted", adoptedBy: `${customerName}, ${customerPhone}` })
        .where(eq(traysTable.id, tray.id));

      return tx
        .insert(adoptionsTable)
        .values({
          trayId: tray.id,
          customerName,
          customerPhone,
          wantTrayAddon: Boolean(wantTrayAddon),
          wantGuideAddon: Boolean(wantGuideAddon),
          totalRupees,
          status: "pending",
        })
        .returning();
    });

    logger.info({ adoptionId: adoption.id, trayId: tray.id, customerName }, "Adoption created");
    res.status(201).json({
      id: adoption.id,
      trayId: adoption.trayId,
      customerName: adoption.customerName,
      totalRupees: adoption.totalRupees,
      status: adoption.status,
    });
  } catch (err) {
    logger.error({ err }, "Failed to create adoption");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
