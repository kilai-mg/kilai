import { Router, type IRouter } from "express";
import { db, traysTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  if (!db) {
    res.json({ available: 0, adopted: 0, growing: 0, total: 0 });
    return;
  }

  try {
    const rows = await db
      .select({
        status: traysTable.status,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(traysTable)
      .groupBy(traysTable.status);

    const counts: Record<string, number> = {};
    for (const row of rows) counts[row.status] = row.count;

    const available = counts["available"] ?? 0;
    const adopted   = counts["adopted"]   ?? 0;
    const growing   = (counts["growing"] ?? 0) + (counts["harvested"] ?? 0) + (counts["delivered"] ?? 0);
    const total     = available + adopted + growing;

    res.json({ available, adopted, growing, total });
  } catch (err) {
    logger.error({ err }, "Failed to fetch stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
