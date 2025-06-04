import { and, eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { submission } from "../models/submission.model.js";
import logger from "../utils/logger.js";

export const getAllSubmissions = async (req, res) => {
  try {
    logger.info("Getting all submission...");
    const userId = req.user.id;

    const [submissionData] = await db
      .select()
      .from(submission)
      .where(eq(submission.userId, userId));

    return res.status(200).json({
      message: "Submissions fetched successfully....",
      data: submissionData,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  try {
    logger.info("Getting submissions for problemId");

    const userId = req.user.id;
    const problemId = req.params.problemId;

    const [submissionData] = await db
      .select()
      .from(submission)
      .where(
        and(eq(submission.userId, userId), eq(submission.problemId, problemId))
      );

    return res.status(200).json({
      message: "Submissions fetched successfully",
      data: [submissionData],
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    logger.info("Getting all submissions for problem");
    const problemId = req.params.problemId;
    const submissionData = await db
      .select()
      .from(submission)
      .where(eq(submission.problemId, problemId));

    return res.status(200).json({
      message: "Submissions fetched successfully",
      data: submissionData,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
