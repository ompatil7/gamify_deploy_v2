import mongoose from "mongoose";

//initiating connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected, name is : ${conn.connection.name}`);
    // console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    //just exit this process if connection fails
    process.exit(1);
  }
};

export default connectDB;
