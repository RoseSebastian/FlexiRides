import { Car } from "../models/carModel.js";
import { Feature } from "../models/featureModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

export const createCar = async (req, res) => {
  try {
    let imageUrl = "";
    const {
      model,
      licensePlate,
      bodyType,
      fuelType,
      transmission,
      year,
      seats,
      dealerId,
      price,
    } = req.body;

    if (
      !model ||
      !licensePlate ||
      !bodyType ||
      !fuelType ||
      !transmission ||
      !year ||
      !seats ||
      !dealerId ||
      !price
    ) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const isCarExists = await Car.findOne({ licensePlate });
    if (isCarExists) {
      return res.status(400).json({ message: `This car already exists` });
    }

    if(req.files && req.files.image){
      imageUrl = await uploadToCloudinary(req.files.image, 'car_images');
    }

    const car = new Car({...req.body, image: imageUrl?.secure_url});
    const savedCar = await car.save();
    const populatedCar = await Car.findById(savedCar._id).populate('features');
    res.json({ data: populatedCar, message: "Car added successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Combined Search and Get All Cars API with Pagination
//To get the first 20 cars:http://localhost:5000/api/cars?limit=20&page=1
//To get the next 20 cars:http://localhost:5000/api/cars?limit=20&page=2
//To search for cars:http://localhost:5000/api/cars?q=sedan&limit=20&page=1
export const searchCars = async (req, res) => {
  try {
    const searchString = req.query.q;
    const limit = parseInt(req.query.limit) || 20; // Default limit is 20
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const skip = (page - 1) * limit;

    let query = {};

    if (searchString) {
      const searchRegex = new RegExp(searchString, 'i'); // 'i' for case-insensitive
      const searchNumber = parseFloat(searchString);

      // Find matching features
      const matchingFeatures = await Feature.find({ name: searchRegex }).select('_id');
      const featureIds = matchingFeatures.map(feature => feature._id);

      query = {
        $or: [
          { model: searchRegex },
          { licensePlate: searchRegex },
          { bodyType: searchRegex },
          { fuelType: searchRegex },
          { transmission: searchRegex },
          { seats: isNaN(searchNumber) ? undefined : searchNumber },
          { year: isNaN(searchNumber) ? undefined : searchNumber },
          { price: isNaN(searchNumber) ? undefined : searchNumber },
          { features: { $in: featureIds } },
        ].filter(condition => condition !== undefined),
      };
    }

    const cars = await Car.find(query).limit(limit).skip(skip).populate('features');
    const totalCars = await Car.countDocuments(query);

    res.json({
      cars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
    .populate('features');
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    .populate('features');
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    let imageUrl = "";
    const {
      model,
      licensePlate,
      bodyType,
      fuelType,
      transmission,
      year,
      seats,
      dealerId,
      price,
    } = req.body;

    if (
      !model ||
      !licensePlate ||
      !bodyType ||
      !fuelType ||
      !transmission ||
      !year ||
      !seats ||
      !dealerId ||
      !price
    ) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    if(req.files && req.files.image){
      imageUrl = await uploadToCloudinary(req.files.image, 'car_images');
    }
    const car = await Car.findByIdAndUpdate(req.params.id, {...req.body, image: imageUrl?.secure_url}, {
      new: true
    })
    .populate('features');
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//toggle car status
export const toggleStatus = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    car.isActive = !car.isActive;
    const savedCar = await car.save();
    const populatedCar = await Car.findById(savedCar._id).populate('features');
    res.json(populatedCar);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};