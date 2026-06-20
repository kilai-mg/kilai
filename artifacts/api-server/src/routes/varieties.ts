import { Router, type IRouter } from "express";
import { db, varietiesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/varieties", async (_req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const varieties = await db
      .select()
      .from(varietiesTable)
      .orderBy(asc(varietiesTable.id));

    res.json(varieties);
  } catch (err) {
    logger.error({ err }, "Failed to fetch varieties");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
