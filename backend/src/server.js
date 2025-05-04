import express from "express";
import { _config } from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";
import morgan from "morgan";
import accessLogStream from "./utils/morgan.js";
import authRoutes from "./routes/user.route.js";
import problemRoute from "./routes/problem.route.js"
const app = express();
const PORT = _config.PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem",problemRoute)

// Error handler middleware placeholder
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Database URI: ${_config.DATABASE_URI}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

export default app; 