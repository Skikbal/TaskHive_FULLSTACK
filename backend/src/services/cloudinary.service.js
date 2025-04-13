import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "../utils/logger.js";

import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFilesToCloudinary = async (file) => {
  const { path, mimetype, size } = file;
  try {
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    const optimizedUrl = cloudinary.url(response.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });
    fs.unlinkSync(path);
    return { url: optimizedUrl, mimetype, size };
  } catch (error) {
    fs.unlinkSync(path);
    logger.warn("error while uploading document", error);
    return null;
  }
};

export default uploadFilesToCloudinary;
