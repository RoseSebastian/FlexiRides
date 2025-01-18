import express from "express";
import { addCarFeatures, deleteCarFeatures, getAllFeatures } from "../controllers/featureController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/addFeature", adminAuth, addCarFeatures);

router.get("/allFeatures", adminAuth, getAllFeatures);

router.delete("/delete/:id", adminAuth, deleteCarFeatures);

export { router as featureRouter };