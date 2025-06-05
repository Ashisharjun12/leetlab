import { and, eq, sql } from "drizzle-orm";
import { db } from "../config/database.js";
import { submission } from "../models/submission.model.js";
import logger from "../utils/logger.js";

export const getAllSubmissions = async (req, res) => {
  try {
    logger.info("Getting all submission...");
    const userId = req.user.id;

    const submissionData = await db
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

export const getAllsolvedProblem = async(req,res)=>{
  try {
    logger.info("Getting all solved problems...");
    const userId = req.user.id;

    const solvedProblems = await db
      .select()
      .from(submission)
      .where(
        and(
          eq(submission.userId, userId),
          eq(submission.status, "accepted")
        )
      );

    return res.status(200).json({
      message: "Solved problems fetched successfully",
      data: solvedProblems,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const getSolvedProblemByProblemId = async(req,res)=>{
  try {
    logger.info("Getting solved problem by problemId");
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const solvedProblem = await db
      .select()
      .from(submission)
      .where(
        and(
          eq(submission.userId, userId),
          eq(submission.problemId, problemId),
          eq(submission.status, "accepted")
        )
      );

    if (!solvedProblem.length) {
      return res.status(404).json({
        message: "No solved submission found for this problem",
      });
    }

    return res.status(200).json({
      message: "Solved problem fetched successfully",
      data: solvedProblem,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const getAllSolvedProblemByUserId = async(req,res)=>{
  try {
    logger.info("Getting all solved problems by userId");
    const userId = req.params.userId;

    const solvedProblems = await db
      .select()
      .from(submission)
      .where(
        and(
          eq(submission.userId, userId),
          eq(submission.status, "accepted")
        )
      );

    return res.status(200).json({
      message: "Solved problems fetched successfully",
      data: solvedProblems,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const getSolvedProblemByProblemIdUserId = async(req,res)=>{
  try {
    logger.info("Getting solved problem by problemId and userId");
    const userId = req.params.userId;
    const problemId = req.params.problemId;

    const solvedProblem = await db
      .select()
      .from(submission)
      .where(
        and(
          eq(submission.userId, userId),
          eq(submission.problemId, problemId),
          eq(submission.status, "accepted")
        )
      );

    if (!solvedProblem.length) {
      return res.status(404).json({
        message: "No solved submission found for this problem",
      });
    }

    return res.status(200).json({
      message: "Solved problem fetched successfully",
      data: solvedProblem,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const getActivityStreakByUserId = async(req,res)=>{
  try {
    logger.info("Getting activity streak for userId");
    const userId = req.params.userId;
    const year = req.query.year ? parseInt(req.query.year, 10) : null;

    let dateFilter = {};
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);

      dateFilter = and(
        sql`${submission.createdAt} >= ${startOfYear.toISOString()}`,
        sql`${submission.createdAt} < ${endOfYear.toISOString()}`
      );

    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      dateFilter = sql`${submission.createdAt} >= ${oneYearAgo.toISOString()}`;
    }

    const userSubmissions = await db
      .select({ createdAt: submission.createdAt })
      .from(submission)
      .where(and(eq(submission.userId, userId), dateFilter))
      .orderBy(submission.createdAt);

    if (!userSubmissions || userSubmissions.length === 0) {
      const message = year ? `No submissions found for user ${userId} in year ${year}` : `No submissions found for user ${userId}`;
      return res.status(200).json({
        message: message,
        data: { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, activeDays: [] }
      });
    }

    const submissionDates = userSubmissions
      .map(sub => new Date(sub.createdAt));

    const uniqueActiveDays = [...new Set(submissionDates.map(date => date.toDateString()))].sort((a, b) => new Date(a) - new Date(b));

    const totalActiveDays = uniqueActiveDays.length;

    let currentStreak = 0;
    let longestStreak = 0;

    if (uniqueActiveDays.length > 0) {
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const yesterday = new Date(today);
       yesterday.setDate(yesterday.getDate() - 1);

       let checkingDate = new Date(today);
       let tempCurrentStreak = 0;
       let lastActiveDayTime = new Date(uniqueActiveDays[uniqueActiveDays.length - 1]).setHours(0,0,0,0);

       if (lastActiveDayTime === today.getTime() || lastActiveDayTime === yesterday.getTime()) {
            for (let i = uniqueActiveDays.length - 1; i >= 0; i--) {
                const activeDay = new Date(uniqueActiveDays[i]);
                activeDay.setHours(0, 0, 0, 0);

                if (activeDay.getTime() === checkingDate.getTime()) {
                    tempCurrentStreak++;
                    checkingDate.setDate(checkingDate.getDate() - 1);
                } else if (activeDay.getTime() < checkingDate.getTime()) {
                    break;
                }
            }
            currentStreak = tempCurrentStreak;
       }

       let currentLength = 0;
        for (let i = 0; i < uniqueActiveDays.length; i++) {
            if (i === 0) {
                currentLength = 1;
            } else {
                const prevDay = new Date(uniqueActiveDays[i - 1]);
                prevDay.setHours(0, 0, 0, 0);
                const currentDay = new Date(uniqueActiveDays[i]);
                currentDay.setHours(0, 0, 0, 0);

                const diffTime = currentDay.getTime() - prevDay.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentLength++;
                } else if (diffDays > 1) {
                    if (currentLength > longestStreak) {
                        longestStreak = currentLength;
                    }
                    currentLength = 1;
                } else if (diffDays === 0) {
                }
            }
             if (currentLength > longestStreak) {
                longestStreak = currentLength;
             }
        }

    }
     const activeDaysWithCount = submissionDates.reduce((acc, date) => {
        const dateString = date.toDateString();
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
    }, {});

    const activeDaysArray = Object.keys(activeDaysWithCount).map(dateString => ({
        date: dateString,
        count: activeDaysWithCount[dateString]
    }));

    return res.status(200).json({
      message: "Activity streak calculated successfully",
      data: { currentStreak, longestStreak, totalActiveDays, activeDays: activeDaysArray }
    });

  } catch (error) {
    logger.error("Error getting activity streak:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}