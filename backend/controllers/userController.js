import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";

import { uploadOnCloudinary } from "../utils/helpers/cloudinary.js";
import mongoose from "mongoose";
import Post from "../models/postModel.js";
import Game from "../models/gameModel.js";
import crypto from "crypto";
import sendEmail from "../utils/helpers/sendEmail.js";

//get user
const getUserProfile = async (req, res) => {
  // We will fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

//signup user
const signUpUser = async (req, res) => {
  try {
    //this is possible bcoz of expres middleware acesing fomr data
    const { name, email, username, password } = req.body;

    //check if user exists
    //this will check in db if same email OR username exists
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    //hashing password here, the more that 10 the higher more secure but also slower so 10 good
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    //putting user into database
    await newUser.save();

    if (newUser) {
      //passing response bcoz sending in response
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.messsage });
    console.log("Error in signUpUser", error);
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //finding the user in the database
    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    //(coming from form, hashed in database) - comparison

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    //if succcess
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser : ", error.message);
  }
};
//seearch
const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("-password")
      .select("-updatedAt")
      .select("-email")
      .select("-createdAt")
      .select("-bio");

    if (users.length === 0)
      return res.status(404).json({ error: "No users found" });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in searchUsers: ", err.message);
  }
};

//logout user
const logoutUser = async (req, res) => {
  try {
    //clearing cookie
    res.cookie("jwt", "", { maxAge: 1 }); //after 1 second it will clear
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logoutUser : ", error.message);
  }
};

//toggles state follow/unfollow
const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    //user to follow or unfollow
    const userToModify = await User.findById(id);
    //user who is logged in getting from protectRoute
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      //current user - req.user._id
      //pull method takes out the id of the user to unfollow from the following of the user as we are unfollowing
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      //removing from the folllower's of the user that got unfollowed
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      //adding in following
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //adding in follower
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followUnfollowUser : ", error.message);
  }
};
//update user
const updateUser = async (req, res) => {
  //removed password update
  const { name, email, username, bio } = req.body;
  // let { profilePic } = req.body;
  let profilePic = req.file;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   user.password = hashedPassword;
    // }

    if (profilePic) {
      // destroying old pfp
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      // const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      const uploadedResponse = await uploadOnCloudinary(profilePic.path);
      console.log("user img success", uploadedResponse);
      profilePic = uploadedResponse.secure_url;
      // Upload the image to Cloudinary
      // const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
      // profilePic = uploadedResponse.secure_url;

      // Delete the temporary file
      // fs.unlinkSync(req.file.path);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();
    //password should be  null in respionse
    user.password = null;

    //new optimzed update - to update the users in the replies of the post when the user updates their profile
    //find all posts that the user has replied and update the username and userProfilePic fields
    await Post.updateMany(
      //filter
      { "replies.userId": userId },
      //update
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.userProfilePic,
        },
      },
      //options
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    res.status(200).json({ message: "Profile updated successfully ", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser : ", error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Ensure that both the token and newPassword are provided
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Invalid request. Missing parameters." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    // Hash the new password and reset the token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    //exclude current user from suggested users array
    //also exclude users that the user is already following

    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    //4 users

    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGameToProfile = async (req, res) => {
  try {
    const { gameId, gameName, rank } = req.body;
    const userId = req.user._id;

    // Validate gameId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: "Invalid gameId format" });
    }

    // Find the user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the game already exists in the user's profile
    const existingGame = user.games.find(
      (game) => game.gameId.toString() === gameId
    );

    if (existingGame) {
      // If the rank is different, update the rank
      if (existingGame.rank !== rank) {
        existingGame.rank = rank;

        await user.save();
        return res
          .status(200)
          .json({ message: "Game rank updated in profile", user });
      } else {
        return res.status(400).json({
          error: "Game already exists in user profile with the same rank",
        });
      }
    }

    // Add the game to the user's profile
    user.games.push({
      gameId: new mongoose.Types.ObjectId(gameId),
      gameName,
      rank,
    });
    await user.save();

    // Add the user to the players array in the Game model
    const game = await Game.findById(gameId);
    if (game) {
      game.players.push(userId);
      await game.save();
    } else {
      // Handle the case where the game is not found
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json({ message: "Game added to profile" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in addGameToProfile: ", error.message);
  }
};

const setGamePlayingStatus = async (req, res) => {
  try {
    const { gameId, playDuration } = req.body;
    const userId = req.user._id;

    // Validate gameId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: "Invalid gameId format" });
    }

    // Check if the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game does not exist" });
    }

    // Find the user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the game within the user's games array
    // const gameIndex = user.games.findIndex(
    //   (g) => g.gameId.toString() === gameId
    // );
    const gameIndex = user.games.findIndex(
      (g) => g.gameId.toString() === gameId
    );

    if (gameIndex === -1) {
      return res
        .status(404)
        .json({ message: "Game not found in user profile." });
    }

    // Set the isPlaying status to true and update playDuration
    user.games[gameIndex].isPlaying = true;
    user.games[gameIndex].playDuration = playDuration || 0;

    // Ensure gameId is not changed
    // user.games[gameIndex].gameId = new mongoose.Types.ObjectId(gameId);

    // Save the user document
    await user.save();

    res.status(200).json({ message: "You are now online" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const stopGamePlayingStatus = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    // Validate gameId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: "Invalid gameId format" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the game within the user's games array
    const gameIndex = user.games.findIndex(
      (g) => g.gameId.toString() === gameId
    );

    if (gameIndex === -1) {
      return res
        .status(404)
        .json({ message: "Game not found in user profile." });
    }

    // Check if the game is currently being played
    if (!user.games[gameIndex].isPlaying) {
      return res
        .status(400)
        .json({ message: "Game is not currently being played." });
    }

    // Set the isPlaying status to false and reset playDuration to 0
    user.games[gameIndex].isPlaying = false;
    user.games[gameIndex].playDuration = 0;

    // Ensure gameId is not changed
    // user.games[gameIndex].gameId = new mongoose.Types.ObjectId(gameId);

    // Save the user document
    await user.save();

    res.status(200).json({ message: "You are now offline" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
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
};
