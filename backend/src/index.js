import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT,() => {
      console.log(`Server listining on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error connecting mongodb", err);
    process.exit(1);
  });
