import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendOtp.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendEmail(otp, email, user.firstname + " " + user.lastname);

    user.otp = otp;

    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const currentTime = Date.now();
    if (currentTime > user.otpExpire) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const saltround = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, saltround);
    user.password = hashPass;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      userData,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const saltround = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, saltround);
    let newUser = await User.create({
      username,
      email,
      password: hashPass,
      firstname,
      lastname,
    });

    setCookie(req, res, newUser, "Register Successfully!!");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: true,
        message: "User Not found",
      });
    }

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const { password: _, ...userData } = user.toObject();

    setCookie(req, res, userData, `Welcome Back ${user.username} `);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    });

    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

//refetch user
export const refetch = async (req, res) => {
  try {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({ success: true, user: decoded });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
