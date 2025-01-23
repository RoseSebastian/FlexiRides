import { Car } from "../models/carModel.js";

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
    await car.save();
    res.json({ data: car, message: "Car added successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("features").populate("dealerId");
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("features")
      .populate("dealerId");
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
    });
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
    await car.save();
    res.status(200).json(car);
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