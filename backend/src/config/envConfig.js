import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const config = {
  development: {
    mongoURI: process.env.DEV_MONGO_URI,
    debug: true,
  },
  production: {
    mongoURI: process.env.PROD_MONGO_URI,
    debug: false,
  },
  test: {
    mongoURI: process.env.TEST_MONGO_URI,
    debug: true,
  },
};

const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

//tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

//mailTrap
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = process.env.MAILTRAP_PORT;
const MAILTRAP_USERNAME = process.env.MAILTRAP_USERNAME;
const MAILTRAP_PASSWORD = process.env.MAILTRAP_PASSWORD;

const NODE_ENV = config[process.env.NODE_ENV] || config["development"];

export {
  NODE_ENV,
  PORT,
  MAILTRAP_HOST,
  MAILTRAP_PASSWORD,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CORS_ORIGIN,
};
