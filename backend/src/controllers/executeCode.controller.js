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

// Function to execute code and get results
const executeCodeWithJudge0 = async (source_code, language_id, stdin, expected_outputs) => {
  try {
    //validate test case
    if (
      !Array.isArray(stdin) ||
      !Array.isArray(expected_outputs) ||
      stdin.length !== expected_outputs.length
    ) {
      throw new Error("Invalid test case");
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

    //analyse results
    let AllPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdOut = result.stdout?.trim();
      const expectedOutput = expected_outputs[index]?.trim();
      const passed = stdOut === expectedOutput;

      if (!passed) {
        AllPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        expectedOut: expectedOutput,
        stdOut: stdOut,
        stderr: result.stderr || null,
        compileOut: result.compile_output || null,
        status: mapJudge0Status(result.status.description),
        time: result.time ? `${result.time}ms` : null,
        memory: result.memory ? `${result.memory}KB` : null,
        message: passed ? "Passed" : "Failed",
      };
    });

    return {
      allPassed: AllPassed,
      detailedResults
    };
  } catch (error) {
    logger.error("Error executing code:", error);
    throw error;
  }
};

// Function to create submission and test case results
const createSubmission = async (userId, problemId, source_code, stdin, executionResults, languageId) => {
  try {
    const { allPassed, detailedResults } = executionResults;

    // Create submission
    const [newSubmission] = await db
      .insert(submission)
      .values({
        userId,
        problemId,
        sourceCode: source_code,
        stdIn: JSON.stringify(stdin),
        stdOut: JSON.stringify(detailedResults.map((r) => r.stdOut)),
        stdErr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOut: detailedResults.some((r) => r.compileOut)
          ? JSON.stringify(detailedResults.map((r) => r.compileOut))
          : null,
        status: allPassed ? "accepted" : "wrong_answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
        languageId: languageId,
      })
      .returning();

    // If all passed then mark problem as solved
    if (allPassed) {
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

    // Save individual test cases results
    const testCaseResultsForDb = detailedResults.map((r) => ({
      submissionId: newSubmission.id,
      testCase: r.testCase,
      passed: r.passed,
      stdOut: r.stdOut,
      expectedOut: r.expectedOut,
      stdErr: r.stderr,
      compileOut: r.compileOut,
      status: r.status,
      memory: r.memory,
      time: r.time,
    }));

    await db.insert(testCaseResult).values(testCaseResultsForDb);

    // Fetch the submission with its related test case results
    const submissionWithTestCases = await db
      .select()
      .from(submission)
      .leftJoin(testCaseResult, eq(submission.id, testCaseResult.submissionId))
      .where(eq(submission.id, newSubmission.id))
      .orderBy(testCaseResult.testCase);

    // Structure the response
    const formattedSubmission = {
      ...submissionWithTestCases[0].submission,
      testCaseResult: submissionWithTestCases.map(item => item.test_case_result).filter(Boolean)
    };

    return formattedSubmission;
  } catch (error) {
    logger.error("Error creating submission:", error);
    throw error;
  }
};

// Main controller function - only executes code
export const executeCode = async (req, res) => {
  try {
    logger.info("Executing code");
    const { source_code, language_id, stdin, expected_outputs } = req.body;

    // Execute code and get results
    const executionResults = await executeCodeWithJudge0(source_code, language_id, stdin, expected_outputs);

    // Add language_id to the response data
    const responseData = {
        ...executionResults,
        language_id: language_id 
    };

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      data: responseData // Return the data with language_id
    });
  } catch (error) {
    logger.error("Error in executeCode controller:", error);
    if (error.response) {
      logger.error("Error response data:", error.response.data);
      logger.error("Error response status:", error.response.status);
      logger.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      logger.error("Error request:", error.request);
    } else {
      logger.error("Error message:", error.message);
    }
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Controller for creating submission for executed code
export const createSubmissionForExecutedCode = async (req, res) => {
  try {
    logger.info("Creating submission for executed code");
    console.log("Received request body for submission:", req.body);
    const { problemId } = req.params;
    const { source_code, language_id, stdin, expected_outputs } = req.body;
    const userId = req.user.id;

    // First execute the code
    const executionResults = await executeCodeWithJudge0(source_code, language_id, stdin, expected_outputs);

    // Create submission with results
    const formattedSubmission = await createSubmission(
      userId,
      problemId,
      source_code,
      stdin,
      executionResults,
      language_id
    );

    console.log("submited data",formattedSubmission)

    return res.status(200).json({
      success: true,
      message: "Submission created successfully",
      submissions: [formattedSubmission],
    });
  } catch (error) {
    logger.error("Error creating submission for executed code:", error);
    if (error.response) {
      logger.error("Error response data:", error.response.data);
      logger.error("Error response status:", error.response.status);
      logger.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      logger.error("Error request:", error.request);
    } else {
      logger.error("Error message:", error.message);
    }
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};
