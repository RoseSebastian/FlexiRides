import { Feature } from "../models/featureModel.js";

export const addCarFeatures = async (req, res) => {
  try {
    const feature = req.body;
    if (!feature) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const addedFeature = await Feature.create(feature);
    return res.json({ data: addedFeature, message: "New feature added" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    return res.status(200).json(features);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const deleteCarFeatures = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }
    res.status(200).json({ message: "Feature deleted successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
