import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import {
  getJudge0LanguageId,
  pollbatchResults,
  submitBatch,
} from "../services/judge0.js";
import { problem } from "../models/problem.model.js";
import { eq } from "drizzle-orm";

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
    } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can create problems...",
      });
    }

    // Ensure tags and constraints are arrays
    const processedTags = Array.isArray(tags) 
      ? tags 
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) : []);
    
    const processedConstraints = Array.isArray(constraints) 
      ? constraints 
      : (typeof constraints === 'string' ? constraints.split(',').map(c => c.trim()).filter(c => c) : []);

    try {
      for (const [language, solutionCode] of Object.entries(
        reference_solution
      )) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
          return res.status(400).json({ message: `Language ${language} not supported..` });
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
          console.log("result........",result)

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
        title,
        description,
        difficulty,
        constraints: processedConstraints,
        testCases,
        tags: processedTags,
        example: examples,
        codeSnippets,
        reference_solution: JSON.stringify(reference_solution),
        userId: req.user.id
      }).returning();


      res.status(201).json({
        success:true,
        message:"problem created Successfully",
        problemData:newProblems
      })
    } catch (error) {
        logger.error("Error during problem creation logic:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during problem creation.",
            error: error.message 
        });
    }
  } catch (error) {
    logger.info("create problem error:", error);
  }
};

export const getAllProblem = async (req, res) => {
    try {
        logger.info("hitting get all problem route.....")
        
        const getProblems = await db.select().from(problem)

        if(!getProblems){
            return res.json({error:"problems not found or getting errors..."})
        }

        res.status(200).json({
            success:true,
            message:"getting all problems data...",
            data :getProblems
        })
        
    } catch (error) {
        logger.info("error in getting all problems", error)
        
    }



};

export const getProblemById = async (req, res) => {

    try {
        logger.info("hitting getproblemsby id.....")

        const {id} = req.params;

        const problemGetById = await db.select().from(problem).where(eq(problem.id , id))

        if(!problemGetById){
            return res.json({error:"problem not found by Id..."})
        }

        return res.status(200).json({
            success:true,
            message:"getting problem by Id successfully....",
            data:problemGetById
        })



        
    } catch (error) {
        logger.info("error in getproblem by Id", error)
        
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
    } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admins can update problems...",
      });
    }

    // Check if problem exists
    const existingProblem = await db.select().from(problem).where(eq(problem.id, id));
    if (!existingProblem || existingProblem.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Ensure tags and constraints are arrays
    const processedTags = Array.isArray(tags) 
      ? tags 
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) : []);
    
    const processedConstraints = Array.isArray(constraints) 
      ? constraints 
      : (typeof constraints === 'string' ? constraints.split(',').map(c => c.trim()).filter(c => c) : []);

    try {
      // Validate reference solution if provided
      if (reference_solution) {
        for (const [language, solutionCode] of Object.entries(reference_solution)) {
          const languageId = getJudge0LanguageId(language);

          if (!languageId) {
            return res.status(400).json({ message: `Language ${language} not supported..` });
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
          title: title || existingProblem[0].title,
          description: description || existingProblem[0].description,
          difficulty: difficulty || existingProblem[0].difficulty,
          constraints: processedConstraints.length > 0 ? processedConstraints : existingProblem[0].constraints,
          testCases: testCases || existingProblem[0].testCases,
          tags: processedTags.length > 0 ? processedTags : existingProblem[0].tags,
          example: examples || existingProblem[0].example,
          codeSnippets: codeSnippets || existingProblem[0].codeSnippets,
          reference_solution: reference_solution ? JSON.stringify(reference_solution) : existingProblem[0].reference_solution,
        })
        .where(eq(problem.id, id))
        .returning();

      res.status(200).json({
        success: true,
        message: "Problem updated successfully",
        problemData: updatedProblem
      });
    } catch (error) {
      logger.error("Error during problem update logic:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during problem update.",
        error: error.message
      });
    }
  } catch (error) {
    logger.error("Update problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
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
        const existingProblem = await db.select().from(problem).where(eq(problem.id, id));
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
            deletedProblem: deletedProblem
        });

    } catch (error) {
        logger.error("Delete problem error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during problem deletion",
            error: error.message
        });
    }
};

export const getSolvedProblem = async (req, res) => {};

export const getAttemptedProblem = async (req, res) => {};
