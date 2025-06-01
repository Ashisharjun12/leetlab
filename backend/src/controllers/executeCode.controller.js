import { db } from "../config/database.js";
import { problemSolved } from "../models/problemSolved.model.js";
import { submission } from "../models/submission.model.js";
import { testCaseResult } from "../models/testCaseResult.model.js";
import {
  getLanguageName,
  pollbatchResults,
  submitBatch,
} from "../services/judge0.js";
import logger from "../utils/logger.js";
import { eq, inArray, and } from "drizzle-orm";
import { playlist } from "../models/playlist.model.js";
import { problemInPlaylist } from "../models/problemInPlaylist.model.js";
import { problem } from "../models/problem.model.js";

// Map Judge0 status to our enum values
const mapJudge0Status = (status) => {
  const statusMap = {
    'Accepted': 'accepted',
    'Wrong Answer': 'wrong_answer',
    'Time Limit Exceeded': 'time_limit_exceeded',
    'Memory Limit Exceeded': 'memory_limit_exceeded',
    'Runtime Error': 'runtime_error',
    'Compilation Error': 'compilation_error',
    'Internal Error': 'internal_error'
  };
  return statusMap[status] || 'pending';
};

export const createPlaylist = async (req, res) => {
  try {
    logger.info("Creating playlist");
    const { name, description } = req.body;
    const userId = req.user.id;

    const [playlistData] = await db
      .insert(playlist)
      .values({
        name,
        description,
        userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist: playlistData,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPlayAllListDetails = async (req, res) => {
  try {
    logger.info("Getting all playlist details");

    const playlistDetails = await db.select().from(playlist);

    if (!playlistDetails) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist: playlistDetails,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPlayListDetails = async (req, res) => {
  try {
    logger.info("Getting playlist details");

    const { playlistId } = req.params;

    const [playlistDetails] = await db
      .select()
      .from(playlist)
      .where(eq(playlist.id, playlistId));

    if (!playlistDetails) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // Get problems in the playlist
    const problemsInPlaylist = await db
      .select({
        problem: problem,
      })
      .from(problemInPlaylist)
      .innerJoin(problem, eq(problemInPlaylist.problemId, problem.id))
      .where(eq(problemInPlaylist.playlistId, playlistId));

    const problems = problemsInPlaylist.map(item => item.problem);

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist: {
        ...playlistDetails,
        problems,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    logger.info("Adding problem to playlist");
    const { playlistId } = req.params;
    const { problemIds } = req.body; // array of problme ids

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    const insertedProblems = await db.insert(problemInPlaylist).values(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    ).returning();

    res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist: insertedProblems,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePlayList = async (req, res) => {
  try {
    logger.info("Deleting playlist");
    const { playlistId } = req.params;

    const [playlistData] = await db
      .delete(playlist)
      .where(eq(playlist.id, playlistId)).returning();

    if (!playlistData) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      playlist: playlistData,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    logger.info("Removing problem from playlist");
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    const removedProblems = await db
      .delete(problemInPlaylist)
      .where(
        and(
          eq(problemInPlaylist.playlistId, playlistId),
          inArray(problemInPlaylist.problemId, problemIds)
        )
      ).returning();

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      problemInPlaylist: removedProblems,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const executeCode = async (req, res) => {
  try {
    logger.info("Executing code");
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    //validate test case
    if (
      !Array.isArray(stdin) ||
      !Array.isArray(expected_outputs) ||
      stdin.length !== expected_outputs.length
    ) {
      logger.error("Invalid test case data received");
      return res.status(400).json({ message: "Invalid test case" });
    }

    //prepare each test case for judge0 batch submission
    const submissionData = stdin.map((input, index) => ({
      source_code,
      language_id,
      stdin: input,
      expected_output: expected_outputs[index],
      base64_encoded: false,
      wait: false,
    }));

    logger.info("Submitting batch to Judge0");
    logger.debug("Submission Data:", JSON.stringify(submissionData, null, 2));
    //submit to judge0
    const submissionResponse = await submitBatch(submissionData);
    logger.info("Received submission response from Judge0");
    logger.debug("Submission Response:", JSON.stringify(submissionResponse, null, 2));

    const tokens = submissionResponse.map((res) => res.token);

    logger.info("Polling results from Judge0");
    logger.debug("Tokens:", tokens);
    //poll results from judge0
    const results = await pollbatchResults(tokens);
    logger.info("Received results from Judge0");
    logger.debug("Results:", JSON.stringify(results, null, 2));

    console.log("results execution", results);

    //analyse results
    let AllPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdOut = result.stdout?.trim();
      const expectedOutput = expected_outputs[index]?.trim(); // Add nullish coalescing for safety
      const passed = stdOut === expectedOutput;

      console.log(`Test case ${index + 1}: ${passed ? "Passed" : "Failed"}`);

      if (!passed) {
        AllPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        expectedOut: expectedOutput, // Use expectedOut to match frontend
        stdOut: stdOut, // Use stdOut to match frontend
        stderr: result.stderr || null,
        compileOut: result.compile_output || null,
        status: mapJudge0Status(result.status.description),
        time: result.time ? `${result.time}ms` : null,
        memory: result.memory ? `${result.memory}KB` : null,
        message: passed ? "Passed" : "Failed",
      };
    });

    console.log("detailed results", detailedResults);

    // Create submission first
    const [newSubmission] = await db
      .insert(submission)
      .values({
        userId,
        problemId,
        sourceCode: source_code,
        stdIn: JSON.stringify(stdin), // Store stdin as JSON string
        stdOut: JSON.stringify(detailedResults.map((r) => r.stdOut)), // Use r.stdOut here
        stdErr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOut: detailedResults.some((r) => r.compileOut)
          ? JSON.stringify(detailedResults.map((r) => r.compileOut))
          : null,
        status: AllPassed ? "accepted" : "wrong_answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      })
      .returning();

    //if all passed then user problem solved
    if (AllPassed) {
      await db
        .insert(problemSolved)
        .values({
          userId,
          problemId,
        })
        .onConflictDoNothing({
          target: [problemSolved.userId, problemSolved.problemId]
        });
    }

    //save individual test cases results
    // Ensure testCaseResult has correct column names matching the detailedResults keys
    const testCaseResultsForDb = detailedResults.map((r) => ({
      submissionId: newSubmission.id,
      testCase: r.testCase,
      passed: r.passed,
      stdOut: r.stdOut, // Use r.stdOut here
      expectedOut: r.expectedOut, // Use r.expectedOut here
      stdErr: r.stderr,
      compileOut: r.compileOut,
      status: r.status,
      memory: r.memory,
      time: r.time,
    }));

    await db.insert(testCaseResult).values(testCaseResultsForDb);

    // Fetch the submission with its related test case results for the frontend
    const submissionWithTestCases = await db
      .select()
      .from(submission)
      .leftJoin(testCaseResult, eq(submission.id, testCaseResult.submissionId))
      .where(eq(submission.id, newSubmission.id))
      .orderBy(testCaseResult.testCase); // Order by test case number

    // Structure the response to match the frontend's expectation
    const formattedSubmission = { // Assuming frontend expects a single submission object with a testCaseResult array
      ...submissionWithTestCases[0].submission, // Extract submission details
      testCaseResult: submissionWithTestCases.map(item => item.test_case_result).filter(Boolean) // Extract test results
    };

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submissions: [formattedSubmission], // Wrap in an array to match frontend structure output?.submissions?.[0]
    });
  } catch (error) {
    logger.error("Error executing code:", error);
    // Log specific error details if available
    if (error.response) {
      logger.error("Error response data:", error.response.data);
      logger.error("Error response status:", error.response.status);
      logger.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      logger.error("Error request:", error.request);
    } else {
      logger.error("Error message:", error.message);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
