import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
//create an express instance
const app = express();
//create a new http server and bind it with the express instance
const server = http.createServer(app);

//socket server
//creating sokcet server and then combining it with http srever
//by using this we can handle any http request and also any socket io operation required
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //react app
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

//hashmap to store userid in socket to identify which user is online
const userSocketMap = {}; //userId : socketId

//listen for any incoming connections
io.on("connection", (socket) => {
  //   console.log("user connected ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // [1, 2, 3] - takinbg the keys in the object and converting them to an array

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
    //remove the user id from hashmap
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
