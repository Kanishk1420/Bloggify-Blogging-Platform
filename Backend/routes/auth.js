import { Router } from "express";
import {
  login,
  logout,
  refetch,
  register,
  resetPassword,
  sendOtp,
  checkUsername,
} from "../controller/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refetch", refetch);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);
router.get("/check-username", checkUsername);

export default router;
