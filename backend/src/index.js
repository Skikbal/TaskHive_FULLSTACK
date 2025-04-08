import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import logger from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT,() => {
      logger.info(`Server listining on port: ${PORT}`);
    });
  })
  .catch((err) => {
    logger.e("error connecting mongodb", err);
    process.exit(1);
  });
