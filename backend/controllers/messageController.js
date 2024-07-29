import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    let { img } = req.body;
    const senderId = req.user._id;

    //check if convo already exists

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    //case when sending the first message
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    //we will find all the messages that contain this conversation id to get the whole conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getConversations(req, res) {
  // console.log("inside rel");
  const userId = req.user._id;
  // console.log("userId:", userId); // Debugging line to check the value

  try {
    //get all the conversations which has the logged in user id
    //populate method we will use as we also need the username and userprofilePic of the others
    // const objectId = mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants", //which field this is gonna look into
      select: "username profilePic", //select the fields that u want
    });
    // remove current user(logged in ) from participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.log("helo");
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversations };
