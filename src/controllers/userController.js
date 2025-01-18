import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const salt_rounds = Number(process.env.SALT_ROUNDS);
const removePassword = (user) => {
  const responseUserData = user.toObject();
  delete responseUserData.password;
  return responseUserData;
};

export const userRegister = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;
    if (!username || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, salt_rounds);
    const userData = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    await userData.save();

    const token = generateToken(userData._id);
    res.cookie("token", token);

    const responseUserData = userData.toObject();
    delete responseUserData.password;

    return res.json({
      data: removePassword(userData),
      message: "User registered successfully!",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "User does not exists" });
    }
    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const token = generateToken(userExist._id);
    res.cookie("token", token);

    return res.json({ data: removePassword(userExist), message: "user login success" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({ message: "user logout success" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.loggedInUser.id;
    const userData = await User.findById(userId).select("-password");
    return res.json({ data: userData, message: "user profile fetched" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ username: 1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;
    if (!username || !email || !phone || !address) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const user = await User.findByIdAndUpdate(req.loggedInUser.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const userId = req.loggedInUser.id;
    const userData = await User.findById(userId);
    const passwordMatch = bcrypt.compareSync(oldPassword, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, salt_rounds);

    const user = await User.findByIdAndUpdate(
      userId,
      { ...userData, password: hashedPassword },
      { new: true }
    ).select("-password");;

    res.status(200).json(user);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }

    const userData = await User.find({email});
    if (!userData) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, salt_rounds);

    await User.findByIdAndUpdate(
      userData._id,
      { ...userData, password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
