import express from "express";
import { addReview, deleteReview, getAverageRating, getCarReviews, getBookingReview } from "../controllers/reviewController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/addReview", userAuth, addReview);
router.get("/:id",getCarReviews);
router.get("/booking/:id",getBookingReview);
router.delete('/:id',userAuth,deleteReview);
router.get('/averageRating/:id',getAverageRating);


export { router as reviewRouter };