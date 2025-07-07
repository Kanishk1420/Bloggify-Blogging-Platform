import { Router } from "express";
import {
  deleteComment,
  getAllComment,
  updateComment,
  writeComment,
} from "../controller/comment.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.post("/add", isAuthenticated, writeComment);
router.put("/update", isAuthenticated, updateComment);
router.delete("/:id", isAuthenticated, deleteComment);
router.get("/post/:postId", getAllComment);

export default router;
