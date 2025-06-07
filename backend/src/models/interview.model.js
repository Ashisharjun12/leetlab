import { pgTable,  text, timestamp, jsonb, integer, uuid } from 'drizzle-orm/pg-core';
import { user } from './user.model.js';


export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => user.id , {onDelete:'cascade'}).notNull(),
  jobPosition: text('job_position').notNull(),
  jobDescription: text('job_description').notNull(),
  interviewDifficulty: text('interview_difficulty').notNull().default('medium'), // easy, medium, hard
  interviewType: text('interview_type').notNull(), 
  generatedQuestions: jsonb('generated_questions').default([]), 
  duration: text('duration'),
  feedback: jsonb('feedback').default({}), 
  status: text('status').default('pending'), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


