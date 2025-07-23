import express from "express";
import { getUser, updateUser, followUser, unfollowUser, deleteUser } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Existing routes
router.get("/:id", getUser);
router.put("/", isAuthenticated, updateUser);
router.put("/follow/:id", isAuthenticated, followUser);
router.put("/unfollow/:id", isAuthenticated, unfollowUser);

// Add this route for user deletion
router.delete("/:id", isAuthenticated, deleteUser);

export default router;