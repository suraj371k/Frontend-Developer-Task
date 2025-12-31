import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected successfully!");
  } catch (error) {
    console.log("error in mongodb connections: ", error);
  }
};
