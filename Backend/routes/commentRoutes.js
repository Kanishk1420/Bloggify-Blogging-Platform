import { Router } from "express";
import {
  deleteComment,
  getAllComment,
  updateComment,
  writeComment,
  likeComment,    // Add this import
  unlikeComment,  // Add this import
  dislikeComment, // Add this import
  undislikeComment // Add this import
} from "../controller/comment.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.post("/add", isAuthenticated, writeComment);
router.put("/update", isAuthenticated, updateComment);
router.delete("/:id", isAuthenticated, deleteComment);
router.get("/post/:postId", getAllComment);

// Add these new routes
router.put("/like/:id", isAuthenticated, likeComment);
router.put("/unlike/:id", isAuthenticated, unlikeComment);
router.put("/dislike/:id", isAuthenticated, dislikeComment);
router.put("/undislike/:id", isAuthenticated, undislikeComment);

export default router;
