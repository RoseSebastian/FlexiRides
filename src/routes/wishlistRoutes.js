import express from 'express';
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    findWishlistEntry
} from '../controllers/wishlistController.js';
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Get all wishlist items
router.get('/',userAuth, getWishlist);

// Find an entry in wishlist with carId and userId
router.get('/status/:id', userAuth, findWishlistEntry)

// Add a new item to the wishlist
router.post('/',userAuth, addToWishlist);

// Delete a wishlist item by ID
router.delete('/:id',userAuth, removeFromWishlist);

export { router as wishlistRouter };