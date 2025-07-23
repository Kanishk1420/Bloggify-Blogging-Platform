import { Router } from "express";
import {
  getAllUsers,
  getSearchedUser,
  getUser,
  updateUser,
  deleteUser, // Add this import
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    await getSearchedUser(req, res);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
});
router.get("/allUser", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUser);
router.patch(
  "/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUser
);
router.put(
  "/profile",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUser
);
// router.post("/upload", upload.single("profilePhoto"), uploadProfilePhoto);
router.delete("/:id", isAuthenticated, deleteUser); // Add this DELETE route
export default router;
