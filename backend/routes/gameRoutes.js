import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  addGame,
  deleteGame,
  getAllGames,
  getSingleGame,
  getAllGamesNames,
} from "../controllers/gameController.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.get("/all", getAllGames);
router.get("/allnames", getAllGamesNames);
// router.post("/add", protectRoute, addGame);
router.post(
  "/add",
  protectRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "gifs", maxCount: 4 },
  ]),
  addGame
);
router.delete("/delete/:gameId", protectRoute, deleteGame);
router.get("/:query", protectRoute, getSingleGame);

export default router;
