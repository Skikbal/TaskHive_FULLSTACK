import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connection successfull");
  } catch (error) {
    console.log("failed to connect mongodb",error);
    process.exit(1);
  }
};

export default connectDB;
