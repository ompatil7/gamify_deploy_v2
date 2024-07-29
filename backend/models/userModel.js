import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    games: [
      {
        gameId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
        },
        gameName: { type: String, required: true },
        isPlaying: { type: Boolean, default: false },
        playDuration: { type: Number, default: 0 }, // e.g., hours
        rank: { type: String, required: true }, // e.g., Silver, Gold, etc.
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

// //blueprint of which fields u will have in user
// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter a name"],
//     },
//     username: {
//       type: String,
//       required: [true, "Please enter a username"],
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Please enter your password"],
//       minLength: [8, "Password must be at least 8 characters long"],
//     },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: [String],
//       default: [],
//     },
//     following: {
//       type: [String],
//       default: [],
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.model("User", userSchema);
// //upercase first and singular, for mongoose so that it understands this will creaate users in the database

// export default User;
