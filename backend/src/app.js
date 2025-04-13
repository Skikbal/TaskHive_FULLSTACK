import express from "express";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();

// Needed to get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use(cookieParser());
//todo: implememt cors middleware when needed

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/task", taskRouter);

export default app;
