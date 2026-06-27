import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable, otpCodesTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { logger } from "../lib/logger";
import { createSession, getSession, destroySession, getTokenFromRequest } from "../lib/sessions";

const router: IRouter = Router();

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizePhone(raw: string): string {
  return raw.trim().replace(/\s+/g, "");
}

router.post("/auth/request-otp", async (req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  const { phone } = req.body ?? {};
  if (!phone || typeof phone !== "string") {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.phone, normalizedPhone))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(usersTable).values({ phone: normalizedPhone });
    }

    await db.insert(otpCodesTable).values({ phone: normalizedPhone, code, expiresAt });

    logger.info({ phone: normalizedPhone }, "OTP generated");

    res.json({
      message: "OTP sent to your number",
      devOtp: code,
    });
  } catch (err) {
    logger.error({ err }, "Failed to generate OTP");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/verify-otp", async (req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  const { phone, code } = req.body ?? {};
  if (!phone || !code) {
    res.status(400).json({ error: "phone and code are required" });
    return;
  }

  const normalizedPhone = normalizePhone(phone);
  const now = new Date();

  try {
    const [otp] = await db
      .select()
      .from(otpCodesTable)
      .where(
        and(
          eq(otpCodesTable.phone, normalizedPhone),
          eq(otpCodesTable.code, String(code)),
          eq(otpCodesTable.used, false),
          gt(otpCodesTable.expiresAt, now),
        ),
      )
      .orderBy(otpCodesTable.createdAt)
      .limit(1);

    if (!otp) {
      res.status(401).json({ error: "Invalid or expired OTP" });
      return;
    }

    await db.update(otpCodesTable).set({ used: true }).where(eq(otpCodesTable.id, otp.id));

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, normalizedPhone))
      .limit(1);

    if (!user) {
      res.status(500).json({ error: "User not found after OTP verification" });
      return;
    }

    const token = createSession({ userId: user.id, phone: user.phone, isAdmin: user.isAdmin });

    res.cookie("kilai_session", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    logger.info({ userId: user.id }, "User authenticated");

    res.json({ id: user.id, phone: user.phone, name: user.name, isAdmin: user.isAdmin });
  } catch (err) {
    logger.error({ err }, "Failed to verify OTP");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", async (req: Request, res: Response) => {
  if (!db) { res.status(503).json({ error: "Database not configured" }); return; }

  const token = getTokenFromRequest(req as any);
  const session = getSession(token);

  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .limit(1);

    if (!user) { res.status(401).json({ error: "Session invalid" }); return; }

    res.json({ id: user.id, phone: user.phone, name: user.name, isAdmin: user.isAdmin });
  } catch (err) {
    logger.error({ err }, "Failed to fetch session user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (req: Request, res: Response) => {
  const token = getTokenFromRequest(req as any);
  if (token) destroySession(token);
  res.clearCookie("kilai_session");
  res.json({ ok: true });
});

export default router;
