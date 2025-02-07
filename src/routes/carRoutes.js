import express from "express";
import * as carController from "../controllers/carController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Create a new car
router.post('/add',adminAuth, carController.createCar);

// Route to search for cars or get all cars with pagination for Admin
router.get('/',adminAuth, carController.searchCars);

// Route to search for cars or get all cars with pagination for User
router.get('/all',userAuth, carController.getAllCars);

// Get a single car by ID
router.get('/:id', carController.getCarById);

// Update a car by ID
router.put('/:id',adminAuth, carController.updateCar);

// Toggle car status a car by ID
router.put('/status/:id',adminAuth, carController.toggleStatus);

// Delete a car by ID
router.delete('/:id',adminAuth, carController.deleteCar);

export { router as carRouter };