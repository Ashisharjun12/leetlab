import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import {
  getJudge0LanguageId,
  pollbatchResults,
  submitBatch,
} from "../services/judge0.js";
import { problem } from "../models/problem.model.js";

export const createProblem = async (req, res) => {
  try {
    logger.info("hitting create problem route...");

    const {
      title,
      description,
      difficulty,
      constraints,
      testCases,
      codeSnippets,
      reference_solution,
    } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can create problems...",
      });
    }

    try {
      for (const [language, solutionCode] of Object.entries(
        reference_solution
      )) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId.length == 0) {
          return res.json({ message: "This Language not supported.." });
        }

        //testcases
        const submissions = testCases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));

        const submissionResults = await submitBatch(submissions);

        const tokens = submissionResults.map((res) => res.token);

        const results = await pollbatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          if (result.status.id !== 3) {
            return res
              .status(400)
              .json({
                error: `TestCase ${i + 1} failed for language ${language}`,
              });
          }
        }
      }

      //save in db

      const [newProblems] = await db.insert(problem).values({
        data: {
          title,
          description,
          difficulty,
          constraints,
          testCases,
          codeSnippets,
          reference_solution,
          userId :req.user.id
        },
      });


      res.status(201).json({
        success:true,
        message:"problem created Successfully",
        problemData:newProblems
      })
    } catch (error) {}
  } catch (error) {
    logger.info("create problem error:", error);
  }
};

export const getAllProblem = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getSolvedProblem = async (req, res) => {};

export const getAttemptedProblem = async (req, res) => {};
