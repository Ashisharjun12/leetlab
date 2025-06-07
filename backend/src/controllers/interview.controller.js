import { db } from '../config/database.js';
import { interviews } from '../models/interview.model.js';
import { generateInterviewQuestions } from '../services/aiservice.js';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';

export const createInterview = async (req, res) => {
  try {
    const { jobPosition, jobDescription, interviewType, duration, interviewDifficulty } = req.body;
    const userId = req.user.id; // Assuming you have user info in req.user from auth middleware

    // Validate required fields
    if (!jobPosition || !jobDescription || !interviewType || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate interview difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (interviewDifficulty && !validDifficulties.includes(interviewDifficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview difficulty. Must be one of: easy, medium, hard'
      });
    }

    // Generate interview questions using AI
    const generatedQuestions = await generateInterviewQuestions({
      jobPosition,
      jobDescription,
      interviewType,
      duration,
      interviewDifficulty: interviewDifficulty || 'medium'
    });

    // Create interview record
    const interview = await db.insert(interviews).values({
      id: uuidv4(),
      userId,
      jobPosition,
      jobDescription,
      interviewType,
      interviewDifficulty: interviewDifficulty || 'medium',
      duration,
      generatedQuestions,
      status: 'pending',
      feedback: {}
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Interview created successfully',
      data: interview[0]
    });

  } catch (error) {
    console.error('Error creating interview:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating interview',
      error: error.message
    });
  }
};

export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const userInterviews = await db.select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(interviews.createdAt);

    return res.status(200).json({
      success: true,
      data: userInterviews
    });

  } catch (error) {
    console.error('Error fetching user interviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

export const getInterviewByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.id; 

    const interview = await db.select()
      .from(interviews)
      .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId))); // Add userId check

    if (!interview || interview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or does not belong to the user'
      });
    }

    return res.status(200).json({
      success: true,
      data: interview[0]
    });

  } catch (error) {
    console.error('Error fetching interview by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message
    });
  }
};