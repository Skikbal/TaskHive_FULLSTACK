import mongoose from "mongoose";
import { NODE_ENV } from "../config/envConfig.js";
import logger from "../utils/logger.js";
const connectDB = async (req, res) => {
  try {
    await mongoose.connect(NODE_ENV.mongoURI);
    if (NODE_ENV.debug) {
      mongoose.set("debug", true);
    }
    logger.info("database connection successfull");
  } catch (error) {
    logger.error("failed to connect mongodb", error);
    process.exit(1);
  }
};

export default connectDB;
