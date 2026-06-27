import { Router, type IRouter, type Request, type Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db, adoptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

// POST /api/payments/create-order
// Creates a Razorpay order for a given amount (in rupees)
router.post("/payments/create-order", async (req: Request, res: Response) => {
  const rz = getRazorpay();
  if (!rz) {
    res.status(503).json({ error: "Payment gateway not configured" });
    return;
  }

  const { amount, adoptionId, receipt } = req.body ?? {};

  if (!amount || typeof amount !== "number" || amount < 1) {
    res.status(400).json({ error: "amount (rupees) is required" });
    return;
  }

  try {
    const order = await rz.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: receipt ?? `kilai_${Date.now()}`,
      notes: adoptionId ? { adoptionId: String(adoptionId) } : {},
    });

    logger.info({ orderId: order.id, amount }, "Razorpay order created");
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    logger.error({ err }, "Failed to create Razorpay order");
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST /api/payments/verify
// Verifies Razorpay signature after successful payment and marks adoption as confirmed
router.post("/payments/verify", async (req: Request, res: Response) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) {
    res.status(503).json({ error: "Payment gateway not configured" });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, adoptionId } = req.body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: "Missing payment fields" });
    return;
  }

  // Verify HMAC-SHA256 signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    logger.warn({ razorpay_order_id }, "Razorpay signature mismatch");
    res.status(400).json({ error: "Payment verification failed" });
    return;
  }

  // Mark adoption confirmed and store payment ID
  if (adoptionId && db) {
    try {
      await db
        .update(adoptionsTable)
        .set({ status: "confirmed", razorpayPaymentId: razorpay_payment_id })
        .where(eq(adoptionsTable.id, Number(adoptionId)));
      logger.info({ adoptionId, razorpay_payment_id }, "Adoption confirmed after payment");
    } catch (err) {
      logger.error({ err }, "Failed to update adoption after payment");
    }
  }

  res.json({ ok: true, paymentId: razorpay_payment_id });
});

export default router;
