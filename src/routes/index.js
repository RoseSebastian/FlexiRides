import express from "express";
import { userRouter } from "./userRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import { featureRouter } from "./featureRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/features", featureRouter);

export { router as apiRouter };