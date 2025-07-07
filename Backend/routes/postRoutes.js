import { Router } from "express";
import {
  addBookmark,
  deletePost,
  getAllPost,
  getAnalytics,
  getFollowingPost,
  getPost,
  getSearchedPost,
  likePost,
  removeBookmark,
  unlikePost,
  updatePost,
  uploadImage,
  userPost,
  writePost,
} from "../controller/post.js";
import { isAuthenticated } from "../middleware/auth.js";

import multer from "multer";
import upload from "../middleware/multer.js";

const router = Router();

router.get('/analytics', isAuthenticated, getAnalytics)
router.get('/followings', isAuthenticated, getFollowingPost)
router.get("/search", getSearchedPost);
router.get("/user/:userId", isAuthenticated, userPost);
router.get("/:id", getPost);
router.get("/", getAllPost);
router.post("/create", isAuthenticated, writePost);
router.put("/:id", isAuthenticated, upload.single("image"), updatePost);
router.delete("/:id", isAuthenticated, deletePost);

router.put("/like/:id", isAuthenticated, likePost);
router.put("/unlike/:id", isAuthenticated, unlikePost);

router.put("/addbookmark/:id", isAuthenticated, addBookmark);
router.put("/removebookmark/:id", isAuthenticated, removeBookmark);

//Image Upload

router.post("/upload", upload.single("image"), uploadImage);

export default router;
