import mongoose from "mongoose";
import logger from "../utils/logger.js";
const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("database connection successfull");
  } catch (error) {
    logger.error("failed to connect mongodb", error);
    process.exit(1);
  }
};

export default connectDB;
