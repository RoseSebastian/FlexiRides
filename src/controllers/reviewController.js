import { Car } from "../models/carModel.js";
import { Review } from "../models/ratingModel.js";

export const addReview = async (req, res) => {
    try {
        const { carId,bookingId, rating, comment } = req.body;
        const userId = req.loggedInUser.id;
        
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        if (rating > 5 || rating <= 1) {
            return res.status(400).json({ message: "Please provide a proper rating" });
        }

        // Create or update the review
        const review = await Review.findOneAndUpdate({ userId, carId, bookingId }, { rating, comment }, { new: true, upsert: true });

        res.status(201).json({ data: review, message: "Review added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getCarReviews = async (req, res) => {
    try {
        const  carId  = req.params.id;

        const reviews = await Review.find({carId: carId,}).populate("userId", "username").sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this car" });
        }
        
        res.status(200).json({ data: reviews, message: "reviews fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const  reviewId  = req.params.id;
        const userId = req.loggedInUser.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or not authorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const carId  = req.params.id;

        const reviews = await Review.find({ carId });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this car" });
        }

        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ data: averageRating, message: "avg reviews fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getBookingReview = async (req, res) => {
    try {
        const  bookingId  = req.params.id;

        const review = await Review.find({bookingId: bookingId});
        
        res.status(200).json({ data: review, message: "reviews fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};