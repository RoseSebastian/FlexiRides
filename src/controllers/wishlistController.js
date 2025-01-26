import { Wishlist } from '../models/wishlistModel.js';

// Add a car to the wishlist
export const addToWishlist = async (req, res) => {
    try {
        
        const carId = req.body.carId;
        console.log(req.loggedInUser);
        const userId = req.loggedInUser.id;
        
        const newWishlistItem = new Wishlist({ userId, carId });
        const savedData = await newWishlistItem.save();
        console.log(savedData);
        const populatedData = await Wishlist.findById(savedData._id)
              .populate({
                path: 'carId'
              });
        res.status(201).json(populatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all wishlist items for a user
export const getWishlist = async (req, res) => {
    try {
        const  userId  = req.loggedInUser.id;
        const wishlistItems = await Wishlist.find({ userId }).populate('carId');
        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a car from the wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const carId = req.params.id;
        const userId = req.loggedInUser.id;
        await Wishlist.findOneAndDelete({ userId, carId });
        res.status(200).json({ message: 'Car removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};