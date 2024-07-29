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
import fs from "fs";
import { app, server } from "./socket/socket.js";
import { fileURLToPath } from "url";
import cors from "cors";
//to use the import syntax we changed the type to module
//to use the import syntax we changed the type to module
//instead of using require
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory exists
const tempDir = path.join(__dirname, "./public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
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
const allowedOrigins = [
  "http://localhost:3000",
  "https://gamify-deploy-v3.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://gamify-deploy-v3.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

//allows you to parse incoming data from request object, req.body
app.use(express.json({ limit: "50mb" }));

//urlencoded is used to parse form data in req.body
//true bcoz if the req body has some nested objects it would be able to parse
app.use(express.urlencoded({ extended: true }));

//get cookie from request and set cookie in response
app.use(cookieParser());

//routes
app.get("/", (req, res) => res.send("Express on render"));

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
