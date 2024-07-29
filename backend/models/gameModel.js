import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the game name"],
      unique: true,
    },
    image: { type: String, default: "" },
    logo: { type: String, default: "" },
    tags: [
      {
        type: String,
        required: [true, "Please enter atleast 1 tag"],
      },
    ],
    gifs: [
      {
        type: String,
        required: [true, "Please enter atleast 1 gif"],
        unique: true,
      },
    ],
    description: {
      type: String,
      required: [true, "Please enter the game description"],
      unique: true,
    },
    players: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    ],
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
