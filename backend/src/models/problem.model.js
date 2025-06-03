import { pgTable, uuid, text, timestamp,  jsonb } from 'drizzle-orm/pg-core';
import { user } from './user.model.js';
import { problemDifficulty } from './enums.models.js';


export const problem = pgTable('problem', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    companies: jsonb('companies').default([]),
    description: text('description').notNull(),
    difficulty: problemDifficulty('problem_difficulty').default('easy').notNull(),
    problemImage:jsonb('problem_image'),
    tags: text('tags').array().default([]),
    example: jsonb('example').default({}),
    constraints: text('constraints').array().default([]),
    hints: jsonb('hints').default([]),
    editorial: jsonb('editorial'),
    testCases: jsonb('test_cases').default([]),
    submissions: text("submissions").array().default([]),
    codeSnippets: jsonb('code_snippets').default({}),
    reference_solution: jsonb('reference_solution').default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});



