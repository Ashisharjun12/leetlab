import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import {
  getJudge0LanguageId,
  pollbatchResults,
  submitBatch,
} from "../services/judge0.js";
import { problem } from "../models/problem.model.js";
import { eq, sql } from "drizzle-orm";
import { problemSolved } from "../models/problemSolved.model.js";
import { Company } from "../models/company.model.js";

export const createProblem = async (req, res) => {
  try {
    logger.info("hitting create problem route...");

    const {
      title,
      description,
      difficulty,
      constraints,
      testCases,
      tags,
      examples,
      codeSnippets,
      reference_solution,
      companyId
      
    } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can create problems...",
      });
    }

  

    // Validate companyId if provided
    if (companyId) {
      logger.info(`Validating company ID: ${companyId}`);
      const [company] = await db
        .select()
        .from(Company)
        .where(eq(Company.id, companyId));

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID provided",
        });
      }
      logger.info(`Company found: ${company.name}`);
    }

    // Ensure tags and constraints are arrays
    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    const processedConstraints = Array.isArray(constraints)
      ? constraints
      : typeof constraints === "string"
      ? constraints
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c)
      : [];

    try {
      for (const [language, solutionCode] of Object.entries(
        reference_solution
      )) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
          return res
            .status(400)
            .json({ message: `Language ${language} not supported..` });
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
          console.log("result........", result);

          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `TestCase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }

      // Create problem with companyId
      const [newProblem] = await db
        .insert(problem)
        .values({
          title,
          description,
          difficulty,
          constraints: processedConstraints,
          testCases,
          tags: processedTags,
          example: examples,
          codeSnippets,
          reference_solution: JSON.stringify(reference_solution),
          userId: req.user.id,
          companyId: companyId || null,
        })
        .returning();

      // If companyId is provided, get company details
      let companyDetails = null;
      if (companyId) {
        const [company] = await db
          .select()
          .from(Company)
          .where(eq(Company.id, companyId));
        companyDetails = company;
      }

      res.status(201).json({
        success: true,
        message: "Problem created successfully",
        data: {
          ...newProblem,
          company: companyDetails ? {
            id: companyDetails.id,
            name: companyDetails.name
          } : null
        }
      });
    } catch (error) {
      logger.error("Error during problem creation logic:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during problem creation.",
        error: error.message,
      });
    }
  } catch (error) {
    logger.error("Create problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllProblem = async (req, res) => {
  try {
    logger.info("hitting get all problem route.....");

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count of problems
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(problem);

    // Get problems with pagination
    const problems = await db
      .select()
      .from(problem)
      .limit(limit)
      .offset(offset)
      .orderBy(problem.createdAt);

    if (!problems || problems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No problems found",
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Problems retrieved successfully",
      data: problems,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    });
  } catch (error) {
    logger.error("Error in getting all problems:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving problems",
      error: error.message
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    logger.info("hitting getproblemsby id.....");

    const { id } = req.params;

    const problemGetById = await db
      .select()
      .from(problem)
      .where(eq(problem.id, id));

    if (!problemGetById) {
      return res.json({ error: "problem not found by Id..." });
    }

    return res.status(200).json({
      success: true,
      message: "getting problem by Id successfully....",
      data: problemGetById,
    });
  } catch (error) {
    logger.info("error in getproblem by Id", error);
  }
};

export const updateProblemById = async (req, res) => {
  try {
    logger.info("hitting update problem route...");

    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      constraints,
      testCases,
      tags,
      examples,
      codeSnippets,
      reference_solution,
      companyId
    } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can update problems...",
      });
    }

    // Check if problem exists
    const [existingProblem] = await db
      .select()
      .from(problem)
      .where(eq(problem.id, id));

    if (!existingProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Validate company if provided
    if (companyId) {
      const [company] = await db
        .select()
        .from(Company)
        .where(eq(Company.id, companyId));

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID provided",
        });
      }
      logger.info(`Company found: ${company.name}`);
    }

    // Ensure tags and constraints are arrays
    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : existingProblem.tags;

    const processedConstraints = Array.isArray(constraints)
      ? constraints
      : typeof constraints === "string"
      ? constraints
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c)
      : existingProblem.constraints;

    try {
      // Validate reference solution if provided
      if (reference_solution) {
        for (const [language, solutionCode] of Object.entries(
          reference_solution
        )) {
          const languageId = getJudge0LanguageId(language);

          if (!languageId) {
            return res
              .status(400)
              .json({ message: `Language ${language} not supported..` });
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
              return res.status(400).json({
                error: `TestCase ${i + 1} failed for language ${language}`,
              });
            }
          }
        }
      }

      // Update in db
      const [updatedProblem] = await db
        .update(problem)
        .set({
          title: title || existingProblem.title,
          description: description || existingProblem.description,
          difficulty: difficulty || existingProblem.difficulty,
          constraints: processedConstraints,
          testCases: testCases || existingProblem.testCases,
          tags: processedTags,
          example: examples || existingProblem.example,
          codeSnippets: codeSnippets || existingProblem.codeSnippets,
          reference_solution: reference_solution
            ? JSON.stringify(reference_solution)
            : existingProblem.reference_solution,
          companyId:existingProblem.companyId, 
        })
        .where(eq(problem.id, id))
        .returning();

      // Get company details if company ID is present
      let companyDetails = null;
      if (updatedProblem.companyId) {
        const [company] = await db
          .select()
          .from(Company)
          .where(eq(Company.id, updatedProblem.companyId));
        companyDetails = company;
      }

      res.status(200).json({
        success: true,
        message: "Problem updated successfully",
        data: {
          ...updatedProblem,
          company: companyDetails ? {
            id: companyDetails.id,
            name: companyDetails.name
          } : null
        }
      });
    } catch (error) {
      logger.error("Error during problem update logic:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during problem update.",
        error: error.message,
      });
    }
  } catch (error) {
    logger.error("Update problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProblemById = async (req, res) => {
  try {
    logger.info("hitting delete problem route...");

    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can delete problems...",
      });
    }

    // Check if problem exists
    const existingProblem = await db
      .select()
      .from(problem)
      .where(eq(problem.id, id));
    if (!existingProblem || existingProblem.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Delete the problem
    const [deletedProblem] = await db
      .delete(problem)
      .where(eq(problem.id, id))
      .returning();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
      deletedProblem: deletedProblem,
    });
  } catch (error) {
    logger.error("Delete problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during problem deletion",
      error: error.message,
    });
  }
};

export const getAllProblemSolvedByUser = async (req, res) => {
  try {
    logger.info("hitting get solved problem route....");
    const userId = req.user.id;

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count of solved problems
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(problemSolved)
      .where(eq(problemSolved.userId, userId));

    // Get solved problems with pagination
    const solvedProblems = await db
      .select({
        id: problemSolved.id,
        problemId: problemSolved.problemId,
        createdAt: problemSolved.createdAt,
        problem: {
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          tags: problem.tags,
          description: problem.description
        }
      })
      .from(problemSolved)
      .innerJoin(problem, eq(problemSolved.problemId, problem.id))
      .where(eq(problemSolved.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(problemSolved.createdAt);

    return res.status(200).json({
      success: true,
      message: solvedProblems.length === 0 ? "No problems solved yet" : "Problems fetched successfully",
      data: solvedProblems,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    });
  } catch (error) {
    logger.error("Error in getAllProblemSolvedByUser:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch solved problems",
      error: error.message
    });
  }
};


