import mongoose from "mongoose";
import Game from "../models/gameModel.js";
import { v2 as cloudinary } from "cloudinary";

// export const addGame = async (req, res) => {
//   try {
//     let { name, description, image, logo, tags, gifs } = req.body;

//     // Check if the game already exists
//     const existingGame = await Game.findOne({ name });
//     if (existingGame) {
//       return res.status(400).json({ error: "Game already exists" });
//     }

//     // Upload image to Cloudinary
//     if (image) {
//       const uploadedResponse = await cloudinary.uploader.upload(image);
//       image = uploadedResponse.secure_url;
//     }

//     // Upload logo to Cloudinary
//     if (logo) {
//       const uploadedResponse = await cloudinary.uploader.upload(logo);
//       logo = uploadedResponse.secure_url;
//     }

//     // Create new game object
//     const newGame = new Game({
//       name,
//       description,
//       image,
//       logo,
//       tags,
//       gifs,
//     });

//     // Save new game to the database
//     await newGame.save();

//     res.status(201).json({ message: "Game added successfully", game: newGame });
//   } catch (error) {
//     console.error("Error adding game:", error);
//     res.status(500).json({ error: "Failed to add game" });
//   }
// };
export const addGame = async (req, res) => {
  try {
    let { name, description, tags } = req.body;
    tags = tags ? JSON.parse(tags) : [];

    // Check if the game already exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(400).json({ error: "Game already exists" });
    }

    let image,
      logo,
      gifs = [];

    // Upload image to Cloudinary
    if (req.files.image) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { resource_type: "image" }
      );
      image = uploadedResponse.secure_url;
    }

    // Upload logo to Cloudinary
    if (req.files.logo) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.files.logo[0].path,
        { resource_type: "image" }
      );
      logo = uploadedResponse.secure_url;
    }

    // Upload GIFs to Cloudinary
    if (req.files.gifs) {
      const gifUploadPromises = req.files.gifs.map((gif) => {
        return cloudinary.uploader.upload(gif.path, { resource_type: "image" });
      });
      const gifUploadResults = await Promise.all(gifUploadPromises);
      gifs = gifUploadResults.map((result) => result.secure_url);
    }

    // Create new game object
    const newGame = new Game({
      name,
      description,
      image,
      logo,
      tags,
      gifs,
    });

    // Save new game to the database
    await newGame.save();

    res.status(201).json({ message: "Game added successfully", game: newGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Failed to add game" });
  }
};

export const getSingleGame = async (req, res) => {
  try {
    const { query } = req.params;
    // console.log(query);
    let game;

    if (query) {
      game = await Game.findOne({
        name: new RegExp(`^${query}$`, "i"),
      }).populate({
        path: "players",
        select: "name username profilePic games followers following",
      });

      // Filter games for all players within players array
      // console.log("in players : ", game.players[0].games[0].gameId);
      // console.log("game  :", game._id);
      // Filter games for all players within players array
      game.players.forEach((player) => {
        // console.log("playeer", player);
        player.games = player.games.filter((gameEntry) => {
          return gameEntry.gameId.toString() === game._id.toString();
        });
      });
    }
    if (!query) {
      return res.status(404).json({ error: "Invalid query" });
    }

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error finding game:", error);
    res.status(500).json({ error: "Failed to find the game" });
  }
};

export const deleteGame = async (req, res) => {
  try {
    // const { id } = req.params;
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(400).json({ error: "Game not found" });
    }
    await Game.findByIdAndDelete(req.params.gameId);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Failed to delete game" });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    // console.log("real ", games);
    res.status(200).json(games);
  } catch (error) {
    console.error("Error getting all games:", error);
    res.status(500).json({ error: "Failed to get games" });
  }
};

export const getAllGamesNames = async (req, res) => {
  try {
    const games = await Game.find().select("name logo");
    res.status(200).json(games);
  } catch (error) {
    console.error("Error getting all games:", error);
    res.status(500).json({ error: "Failed to get games" });
  }
};
