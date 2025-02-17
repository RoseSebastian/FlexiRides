import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, carId, startDate, endDate, totalPrice } =
      req.body;

    const user = await User.findById({_id: userId});
    const car = await Car.findById({_id: carId});
    if (!user || !car) {
      return res
        .status(404)
        .json({ message: "User, Car, or Dealer not found" });
    }

    if (
      !startDate ||
      !endDate ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate))
    ) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }

    const newBooking = new Booking({
      userId: userId,
      carId: carId,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate({
        path: 'userId',
        select: '_id username'
      })
      .populate({
        path: 'carId'
      });
    res.status(201).json(populatedBooking);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate({
        path: 'userId',
        select: '_id username'
      })
      .populate({
        path: 'carId'
      });
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Get user specific bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.loggedInUser.id,
    }).populate("carId");
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Get car specific bookings
export const getBookingsByCarID = async (req, res) => {
  try {
    const bookings = await Booking.find({
      carId: req.params.id,
    }).populate("carId");
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'carId'
      })
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const { userId, carId, startDate, endDate, totalPrice } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.userId = userId || booking.userId;
    booking.carId = carId || booking.carId;   
    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;
    booking.totalPrice = totalPrice || booking.totalPrice;

    const savedBooking =  await booking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate({
        path: 'userId',
        select: '_id username'
      })
      .populate({
        path: 'carId'
      });
    res.status(201).json(populatedBooking);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "canceled";
    const savedBooking =  await booking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate({
        path: 'userId',
        select: '_id username'
      })
      .populate({
        path: 'carId'
      });
    res.status(201).json(populatedBooking);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const failedBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "failed";
    const savedBooking =  await booking.save();
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate({
        path: 'carId'
      });
    res.status(201).json(populatedBooking);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
