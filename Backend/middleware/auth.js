import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  console.log("Cookies received:", req.cookies); // Debug line
  
  // Try to get token from cookies first
  let token = req.cookies.token;
  
  // If not in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log("Using token from Authorization header");
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decode.id;
    next();
  } catch (err) {
    console.log("Token verification error:", err); // Debug line
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
