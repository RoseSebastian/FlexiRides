import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import sendEmail from "../utils/sendMail.js";

const salt_rounds = Number(process.env.SALT_ROUNDS);
const removePassword = (user) => {
  const responseUserData = user.toObject();
  delete responseUserData.password;
  return responseUserData;
};


export const adminRegister = async (req, res) => {
  try {
    let profileUrl = "";
    const { username, email, password, phone, role } = req.body;
    if (!username || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const isUserExist = await Admin.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: `${isUserExist.role} already exists` });
    }
    const hashedPassword = bcrypt.hashSync(password, salt_rounds);

    if(req.files && req.files.profilePic){
      profileUrl = await uploadToCloudinary(req.files.profilePic, 'profile_pictures');
    }

    const userData = new Admin({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      profilePic : profileUrl?.secure_url
    });
    await userData.save();

    const token = generateToken(userData._id, role);
    res.cookie("token", token);

    const responseUserData = userData.toObject();
    delete responseUserData.password;

    return res.json({
      data: removePassword(userData),
      message: `${userData.role} registered successfully!`,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    const userExist = await Admin.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: `${isUserExist.role} does not exists` });
    }
    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = generateToken(userExist._id, userExist.role);
    res.cookie("token", token);

    return res.json({ data: removePassword(userExist), message: "user login success" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const adminLogout = async (req, res) => {
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
    const userData = await Admin.findById(userId).select("-password");
    return res.json({ data: userData, message: "user profile fetched" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const users = await Admin.find().select("-password").sort({ username: 1 });
    res.status(200).json(users);
  } catch (error) {
    res
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

export const getAllAdminsAndUsers = async (req, res) => {
  try {
    const [admins, users] = await Promise.all([
      Admin.find().select("-password").sort({ username: 1 }),
      User.find().select("-password").sort({ username: 1 }),
    ]);

    res.status(200).json({ admins, users });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("-password");
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
    let profileUrl = "";
    const { username, email, phone } = req.body;
    if (!username || !email || !phone) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }
    if(req.files && req.files.profilePic){
      profileUrl = await uploadToCloudinary(req.files.profilePic, 'profile_pictures');
    }
    const user = await Admin.findByIdAndUpdate(req.loggedInUser.id, {...req.body, profilePic: profileUrl?.secure_url}, {
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

export const toggleAdminStatus = async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("-password");
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

export const deleteAdmin = async (req, res) => {
  try {
    const user = await Admin.findByIdAndDelete(req.params.id);
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
    const userData = await Admin.findById(userId);
    const passwordMatch = bcrypt.compareSync(oldPassword, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, salt_rounds);

    const user = await Admin.findByIdAndUpdate(
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
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userData = await Admin.find({email});
    if (!userData) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const resetToken = generateToken(userData, userData.role);
    const resetLink = `${process.env.WEB_URL}/reset-password?token=${resetToken}`;
    const mailBody = `<p>We received a request to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request this, you can ignore this email.</p>
      `;
    const subject = "Password Reset Request";
    sendEmail(email, subject, mailBody)
      .then(() => console.log("Email sent successfully"))
      .catch((error) => console.error("Error sending email:", error));

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, salt_rounds);

    // Update user's password
    const user = await Admin.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};