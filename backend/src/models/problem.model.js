import { pgTable, uuid, text, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { user } from './user.model.js';
import { relations } from 'drizzle-orm';


export const problemDifficulty = pgEnum('problem_difficulty', ['easy', 'medium', 'hard']);

export const problem = pgTable('problem', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    difficulty: problemDifficulty('difficulty').default('easy').notNull(),
    tags: text('tags').array().notNull(),
    example: jsonb('example').notNull(),
    constraints: text('constraints').array().notNull(),
    hints: text('hints'),
    editorial: text('editorial'),
    testCases: jsonb('test_cases').notNull(),
    submissions: text("submissions").array(),
    codeSnippets: jsonb('code_snippets').notNull(),
    reference_solution: text('reference_solution'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

//relations
export const problemRelations = relations(problem, ({ one ,many}) => ({
    user: one(user, {
        fields: [problem.userId],
        references: [user.id],
    }),
    submissions: many(submission),
}));

