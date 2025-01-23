import express from "express";
import { userRouter } from "./userRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import { featureRouter } from "./featureRouter.js";
import { carRouter } from "./carRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/features", featureRouter);
router.use("/cars", carRouter);

export { router as apiRouter };