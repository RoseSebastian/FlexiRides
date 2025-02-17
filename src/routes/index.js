import express from "express";
import { userRouter } from "./userRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import { featureRouter } from "./featureRouter.js";
import { carRouter } from "./carRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { wishlistRouter } from "./wishlistRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/features", featureRouter);
router.use("/cars", carRouter);
router.use("/bookings", bookingRouter);
router.use("/reviews", reviewRouter);
router.use("/wishlist", wishlistRouter);
router.use("/payment", paymentRouter);

export { router as apiRouter };