import { Router, type IRouter } from "express";
import { db, traysTable, varietiesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Shared column selection — flat Tray shape matching the OpenAPI spec
const trayColumns = {
  id: traysTable.id,
  variety: varietiesTable.name,
  category: varietiesTable.category,
  character: varietiesTable.character,
  nutrients: varietiesTable.nutrients,
  nutrientNote: varietiesTable.nutrientNote,
  day: traysTable.day,
  totalDays: traysTable.totalDays,
  price: traysTable.price,
  status: traysTable.status,
  adoptedBy: traysTable.adoptedBy,
};

router.get("/trays", async (_req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const trays = await db
      .select(trayColumns)
      .from(traysTable)
      .innerJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .orderBy(asc(traysTable.id));

    res.json(trays);
  } catch (err) {
    logger.error({ err }, "Failed to fetch trays");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/trays/:id", async (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid tray id" });
    return;
  }

  try {
    const [tray] = await db
      .select(trayColumns)
      .from(traysTable)
      .innerJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .where(eq(traysTable.id, id))
      .limit(1);

    if (!tray) {
      res.status(404).json({ error: "Tray not found" });
      return;
    }

    res.json(tray);
  } catch (err) {
    logger.error({ err, trayId: id }, "Failed to fetch tray");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
