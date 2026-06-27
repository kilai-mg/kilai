import { Router, type IRouter } from "express";
import healthRouter from "./health";
import varietiesRouter from "./varieties";
import traysRouter from "./trays";
import adoptionsRouter from "./adoptions";
import bulkInquiriesRouter from "./bulk_inquiries";
import statsRouter from "./stats";
import authRouter from "./auth";
import adminRouter from "./admin";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(varietiesRouter);
router.use(traysRouter);
router.use(adoptionsRouter);
router.use(bulkInquiriesRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(paymentsRouter);

export default router;
