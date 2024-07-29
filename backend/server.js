import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

import { app, server } from "./socket/socket.js";

//to use the import syntax we changed the type to module
//instead of using require
dotenv.config();
connectDB();
// const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middlewares
//middleware is a function that runs betrween req and resp

//allows you to parse incoming data from request object, req.body
app.use(express.json({ limit: "50mb" }));

//urlencoded is used to parse form data in req.body
//true bcoz if the req body has some nested objects it would be able to parse
app.use(express.urlencoded({ extended: true }));

//get cookie from request and set cookie in response
app.use(cookieParser());

//routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/games", gameRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   // react app
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// server.on("error", (err) => {
//   console.error("Server error:", err);
//   // Restart the server
//   server.close(() => {
//     console.log("Server closed. Restarting...");
//     server.listen(PORT, () => {
//       console.log(`Server started at http://localhost:${PORT}`);
//     });
//   });
// });

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
