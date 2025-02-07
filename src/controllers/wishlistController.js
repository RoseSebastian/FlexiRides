import { Wishlist } from '../models/wishlistModel.js';

// Add a car to the wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { carId, startDate, endDate, noOfDays } = req.body;
        if (!carId || !startDate || !endDate || !noOfDays ) {
            return res.status(400).json({ message: "Mandatory fields are missing" });
          }
        const userId = req.loggedInUser.id;
        
        const newWishlistItem = new Wishlist({ userId, carId, startDate, endDate, noOfDays });
        const savedData = await newWishlistItem.save();
        console.log(savedData);
        const populatedData = await Wishlist.findById(savedData._id)
              .populate({
                path: 'carId'
              });
        res.status(201).json({data:populatedData, message: "Successfully added to favorities"});
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

// Find an entry in wishlist with carId and userId
export const findWishlistEntry = async (req, res) => {
    try {
        const  userId  = req.loggedInUser.id;
        const carId = req.params.id;
        const wishlistEntry = await Wishlist.findOne({ userId, carId }).populate('carId');
        if (!wishlistEntry) {
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }  
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
        res.status(200).json({ message: 'Car removed from Favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};