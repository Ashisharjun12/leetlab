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
import executeCodeRoute from "./routes/execute-code.route.js"
import submissionRoute from "./routes/submission.route.js"
import playlistRoute from "./routes/playlist.route.js"
import companyRoute from "./routes/company.route.js"
import adminRoute from "./routes/admin.route.js"
import uploadRoute from "./routes/upload.route.js"
import discussionRoute from "./routes/discussion.route.js"
import editorialRoute from "./routes/editorial.route.js"
import interviewRoute from "./routes/interview.route.js"
const app = express();
const PORT = _config.PORT;

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
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
app.use("/api/v1/upload",uploadRoute)
app.use("/api/v1/problem",problemRoute)
app.use("/api/v1/execute-code",executeCodeRoute)
app.use("/api/v1/submission",submissionRoute)
app.use("/api/v1/playlist",playlistRoute)
app.use("/api/v1/company",companyRoute)
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/discussion',discussionRoute)
app.use('/api/v1/editorial',editorialRoute)
app.use('/api/v1/interview',interviewRoute)

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
  console.log("promise",promise)
  console.log("reson",reason)
});

export default app; 