import { isAuthenticated } from "../middleware/auth.js";
import {
  addFollower,
  findUser,
  userFollowers,
  userFollowing,
  userUnfollow,
} from "../controller/follow.js";
import { Router } from "express";

const router = Router();

router.get("/:id", isAuthenticated, findUser);
router.get("/following/:id", isAuthenticated, userFollowing);
router.get("/followers/:id", isAuthenticated, userFollowers);
router.put("/follow/:id", isAuthenticated, addFollower);
router.put("/unfollow/:id", isAuthenticated, userUnfollow);

export default router;
