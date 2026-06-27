import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, adoptionsTable, traysTable, varietiesTable, bulkInquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { getSession, getTokenFromRequest } from "../lib/sessions";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req as any);
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!session.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

router.get("/admin/stats", requireAdmin, async (_req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  try {
    const trays = await db.select({ status: traysTable.status }).from(traysTable);
    const adoptions = await db.select({ status: adoptionsTable.status, totalRupees: adoptionsTable.totalRupees }).from(adoptionsTable);

    const trayStats = trays.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = adoptions
      .filter(a => a.status === "confirmed" || a.status === "pending")
      .reduce((sum, a) => sum + a.totalRupees, 0);

    res.json({
      available: trayStats["available"] || 0,
      adopted: trayStats["adopted"] || 0,
      growing: trayStats["growing"] || 0,
      harvested: trayStats["harvested"] || 0,
      delivered: trayStats["delivered"] || 0,
      total: trays.length,
      totalRevenue,
      pendingAdoptions: adoptions.filter(a => a.status === "pending").length,
      confirmedAdoptions: adoptions.filter(a => a.status === "confirmed").length,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/adoptions", requireAdmin, async (_req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  try {
    const rows = await db
      .select({
        id: adoptionsTable.id,
        trayId: adoptionsTable.trayId,
        customerName: adoptionsTable.customerName,
        customerPhone: adoptionsTable.customerPhone,
        wantTrayAddon: adoptionsTable.wantTrayAddon,
        wantGuideAddon: adoptionsTable.wantGuideAddon,
        totalRupees: adoptionsTable.totalRupees,
        status: adoptionsTable.status,
        createdAt: adoptionsTable.createdAt,
        variety: varietiesTable.name,
      })
      .from(adoptionsTable)
      .leftJoin(traysTable, eq(adoptionsTable.trayId, traysTable.id))
      .leftJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .orderBy(adoptionsTable.createdAt);

    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "Failed to list adoptions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/adoptions/:id/status", requireAdmin, async (req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  const id = Number(req.params.id);
  const { status } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  if (!status || typeof status !== "string") { res.status(400).json({ error: "status is required" }); return; }

  const validStatuses = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    return;
  }

  try {
    await db.update(adoptionsTable).set({ status }).where(eq(adoptionsTable.id, id));

    const [row] = await db
      .select({
        id: adoptionsTable.id,
        trayId: adoptionsTable.trayId,
        customerName: adoptionsTable.customerName,
        customerPhone: adoptionsTable.customerPhone,
        wantTrayAddon: adoptionsTable.wantTrayAddon,
        wantGuideAddon: adoptionsTable.wantGuideAddon,
        totalRupees: adoptionsTable.totalRupees,
        status: adoptionsTable.status,
        createdAt: adoptionsTable.createdAt,
        variety: varietiesTable.name,
      })
      .from(adoptionsTable)
      .leftJoin(traysTable, eq(adoptionsTable.trayId, traysTable.id))
      .leftJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .where(eq(adoptionsTable.id, id))
      .limit(1);

    if (!row) { res.status(404).json({ error: "Adoption not found" }); return; }
    res.json({ ...row, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to update adoption status");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/trays", requireAdmin, async (_req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  try {
    const rows = await db
      .select({
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
      })
      .from(traysTable)
      .innerJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .orderBy(traysTable.id);

    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list trays");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/trays/:id/status", requireAdmin, async (req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  const id = Number(req.params.id);
  const { status } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }

  const validStatuses = ["available", "adopted", "growing", "harvested", "delivered"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    await db.update(traysTable).set({ status }).where(eq(traysTable.id, id));

    const [row] = await db
      .select({
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
      })
      .from(traysTable)
      .innerJoin(varietiesTable, eq(traysTable.varietyId, varietiesTable.id))
      .where(eq(traysTable.id, id))
      .limit(1);

    if (!row) { res.status(404).json({ error: "Tray not found" }); return; }
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to update tray status");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/bulk-inquiries", requireAdmin, async (_req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  try {
    const rows = await db.select().from(bulkInquiriesTable).orderBy(bulkInquiriesTable.createdAt);
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "Failed to list bulk inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
