import app from "./app.js";
import connectDB from "./db/db.js";
import logger from "./utils/logger.js";
import { PORT } from "./config/envConfig.js";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server listining on port: ${PORT}`);
    });
  })
  .catch((err) => {
    logger.e("error connecting mongodb", err);
    process.exit(1);
  });
