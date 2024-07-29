import express from "express";
import {
  signUpUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  getSuggestedUsers,
  addGameToProfile,
  setGamePlayingStatus,
  stopGamePlayingStatus,
  searchUsers,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

// router. get post put delete

// /api/users/signup - :
// router.get("/signup", (req, res) => {
//   //   res.send("Signedup successfully"); //send will send data
// });
//this file will get big and big if we do all operations here and it will get complex and unorganized
//so we use controller

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/search", searchUsers);

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put(
  "/update/:id",
  protectRoute,
  upload.single("profilePic"),
  updateUser
);

//game routes
router.post("/addgame", protectRoute, addGameToProfile);
router.post("/set-status", protectRoute, setGamePlayingStatus);
router.post("/remove-status", protectRoute, stopGamePlayingStatus);
export default router;
