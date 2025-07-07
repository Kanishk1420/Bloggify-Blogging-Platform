import jwt from "jsonwebtoken";

export const setCookie = (req, res, user, message) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  console.log("Setting cookie with token:", token.substring(0, 15) + "...");

  // Set cookie options
  res.cookie("token", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: false, // Try setting to false for testing
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  // Send response with token for client storage
  res.json({
    success: true,
    message,
    user,
    token: token, // Include token in response for localStorage approach
  });
};
