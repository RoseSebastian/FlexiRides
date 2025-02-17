import express from "express";  
const router = express.Router();

import { PaymentController, TransactionDetails } from "../controllers/paymentController.js";
import { userAuth } from "../middlewares/userAuth.js";

router.post("/create-checkout-session", userAuth, PaymentController);
router.get("/transaction/:id", userAuth, TransactionDetails);

export { router as paymentRouter };
