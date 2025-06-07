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
import { discussion } from "../models/discussion.model.js";

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
      companyIds,
      hints,
      problemImage
    } = req.body;

    console.log('Received companyIds:', companyIds);

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can create problems...",
      });
    }

    // Validate companyIds if provided
    if (companyIds && companyIds.length > 0) {
      try {
        // Get all companies
        const allCompanies = await db.select().from(Company);
        console.log('All companies:', allCompanies);

        // Filter companies that match the provided IDs
        const validCompanies = allCompanies.filter(company => 
          companyIds.includes(company.id)
        );
        console.log('Valid companies:', validCompanies);

        if (validCompanies.length !== companyIds.length) {
          return res.status(400).json({
            success: false,
            message: "One or more company IDs are invalid",
          });
        }
      } catch (error) {
        console.error('Error validating companies:', error);
        return res.status(400).json({
          success: false,
          message: "Error validating company IDs",
          error: error.message
        });
      }
    }

    // Process and validate test cases
    const processedTestCases = testCases.map((tc, index) => {
      // Ensure input and output are strings
      const input = String(tc.input || '').trim();
      const output = String(tc.output || '').trim();
      
      // Validate input and output
      if (!input || !output) {
        throw new Error(`Test case ${index + 1} input and output cannot be empty`);
      }

      return { input, output };
    });

    // Process other fields
    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter((t) => t)
      : [];

    const processedConstraints = Array.isArray(constraints)
      ? constraints
      : typeof constraints === "string"
      ? constraints.split(",").map((c) => c.trim()).filter((c) => c)
      : [];

    const processedHints = Array.isArray(hints)
      ? hints
      : typeof hints === "string"
      ? hints.split(",").map(h => h.trim()).filter(h => h)
      : [];

    // Process examples
    const processedExamples = {};
    if (examples) {
      Object.entries(examples).forEach(([language, langExamples]) => {
        processedExamples[language] = Array.isArray(langExamples) 
          ? langExamples.map(ex => ({
              input: String(ex.input || '').trim(),
              output: String(ex.output || '').trim(),
              explanation: String(ex.explanation || '').trim()
            }))
          : [];
      });
    }

    // Process reference solutions
    const processedReferenceSolutions = {};
    if (reference_solution) {
      Object.entries(reference_solution).forEach(([language, solution]) => {
        if (typeof solution === 'string' && solution.trim() !== '') {
          processedReferenceSolutions[language] = solution.trim();
        }
      });
    }

    try {
      // Validate reference solutions if provided
      if (Object.keys(processedReferenceSolutions).length > 0) {
        for (const [language, solutionCode] of Object.entries(processedReferenceSolutions)) {
          const languageId = getJudge0LanguageId(language);

          if (!languageId) {
            return res.status(400).json({ 
              success: false,
              message: `Language ${language} not supported..` 
            });
          }

          // Test solution against test cases
          const submissions = processedTestCases.map(({ input, output }, index) => {
            console.log(`Creating submission for test case ${index + 1}:`, {
              language,
              input,
              expectedOutput: output
            });
            
            return {
              source_code: solutionCode,
              language_id: languageId,
              stdin: input,
              expected_output: output
            };
          });

          try {
            const { data: submissionResults, submissionMap } = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollbatchResults(tokens, submissionMap);

            // Check if any test case failed
            const failedTests = results.filter(result => {
              const actualOutput = String(result.stdout || '').trim();
              const expectedOutput = String(result.expected_output || '').trim();
              
              console.log('Comparing test case outputs:', {
                actualOutput,
                expectedOutput,
                match: actualOutput === expectedOutput
              });
              
              return actualOutput !== expectedOutput;
            });

            if (failedTests.length > 0) {
              const failedTest = failedTests[0];
              return res.status(400).json({
                success: false,
                message: `Test case ${failedTest.index + 1} failed for language ${language}`,
                details: {
                  expected: failedTest.expected_output,
                  actual: failedTest.stdout
                }
              });
            }
          } catch (error) {
            console.error('Error testing solution:', error);
            return res.status(400).json({
              success: false,
              message: `Error testing solution for language ${language}`,
              error: error.message
            });
          }
        }
      }

      // Create problem with companyIds and problemImage
      const [newProblem] = await db
        .insert(problem)
        .values({
          title,
          description,
          difficulty,
          constraints: processedConstraints,
          testCases: processedTestCases,
          tags: processedTags,
          example: processedExamples,
          codeSnippets,
          reference_solution: processedReferenceSolutions,
          userId: req.user.id,
          companies: companyIds || [],
          problemImage: problemImage || null,
          hints: processedHints,
        })
        .returning();

      console.log('Created problem:', newProblem);

      // Create an initial discussion 
      try {
        await db
          .insert(discussion)
          .values({
            problemId: newProblem.id,
            userId: req.user.id, // (admin)
            title: `Discussion for ${newProblem.title}`,
            content: `Welcome to the discussion thread for ${newProblem.title}! Feel free to share your thoughts, solutions, or ask questions here.`, // Default content
          });
        logger.info(`Discussion thread created for problem ${newProblem.id}`);
      } catch (discussionError) {
        logger.error("Error creating discussion for problem:", discussionError);
        console.log("dicussicon error ",discussionError)
      
      }

      // Get company details for the response
      const allCompanies = await db.select().from(Company);
      const companyDetails = allCompanies.filter(company => 
        newProblem.companies.includes(company.id)
      );
      console.log('Company details for response:', companyDetails);

      res.status(201).json({
        success: true,
        message: "Problem created successfully",
        data: {
          ...newProblem,
          companies: companyDetails.map(company => ({
            id: company.id,
            name: company.name,
            companyUrl: company.companyUrl
          }))
        }
      });
    } catch (error) {
      console.error('Error creating problem:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during problem creation.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Create problem error:', error);
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
      companyId,
      hints
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

    // Ensure hints is an array
    const processedHints = Array.isArray(hints)
      ? hints
      : typeof hints === "string"
        ? hints.split(",").map(h => h.trim()).filter(h => h)
        : [];

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
          hints: processedHints,
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


