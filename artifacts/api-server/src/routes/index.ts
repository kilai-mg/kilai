import { Router, type IRouter } from "express";
import healthRouter from "./health";
import varietiesRouter from "./varieties";
import traysRouter from "./trays";
import adoptionsRouter from "./adoptions";
import bulkInquiriesRouter from "./bulk_inquiries";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(varietiesRouter);
router.use(traysRouter);
router.use(adoptionsRouter);
router.use(bulkInquiriesRouter);

export default router;
