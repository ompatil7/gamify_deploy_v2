import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
} from "../controllers/postController.js";

import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:postId", protectRoute, deletePost);
router.post("/create", protectRoute, createPost);
router.put("/like/:postId", protectRoute, likeUnlikePost); //toggle state
router.put("/reply/:postId", protectRoute, replyToPost); //toggle state
export default router;
