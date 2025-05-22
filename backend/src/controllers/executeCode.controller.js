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
import { eq } from "drizzle-orm";

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

    //submit to judge0
    const submissionResponse = await submitBatch(submissionData);

    const tokens = submissionResponse.map((res) => res.token);

    //poll results from judge0
    const results = await pollbatchResults(tokens);

    console.log("results execution", results);

    //analyse results
    const AllPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdOut = result.stdout?.trim();
      const expectedOutput = expected_outputs[index].trim();
      const passed = stdOut === expectedOutput;

      console.log(`Test case ${index + 1}: ${passed ? "Passed" : "Failed"}`);

      if (!passed) {
        AllPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        expected: expectedOutput,
        stderr: result.stderr || null,
        compiledOutput: result.compile_output || null,
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
        stdIn: stdin.join("\n"),
        stdOut: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stdErr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOut: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
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
    const testCaseResults = detailedResults.map((r) => ({
      submissionId: newSubmission.id,
      testCase: r.testCase,
      passed: r.passed,
      stdOut: r.stdout,
      expectedOut: r.expected,
      stdErr: r.stderr,
      compileOut: r.compiledOutput,
      status: r.status,
      memory: r.memory,
      time: r.time,
    }));

    await db.insert(testCaseResult).values(testCaseResults);

    const submissionWithTestCases = await db
      .select()
      .from(submission)
      .leftJoin(testCaseResult, eq(submission.id, testCaseResult.submissionId))
      .where(eq(submission.id, newSubmission.id));

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submissions: submissionWithTestCases,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
