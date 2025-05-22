import { pgTable, uuid, text, timestamp,  jsonb } from 'drizzle-orm/pg-core';
import { user } from './user.model.js';
import { relations } from 'drizzle-orm';
import { Company } from './company.model.js';
import { problemDifficulty } from './enums.models.js';
import { submission } from './submission.model.js';
import { problemInPlaylist } from './problemInPlaylist.model.js';





export const problem = pgTable('problem', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    companyId: uuid('company_id').references(() => Company.id, { onDelete: 'cascade' }).default(null),
    description: text('description').notNull(),
    difficulty: problemDifficulty('problem_difficulty').default('easy').notNull(),
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
export const problemRelations = relations(problem, ({ one, many }) => ({
    user: one(user, {
        fields: [problem.userId],
        references: [user.id],
    }),
    submissions: many(submission),
    playlists: many(problemInPlaylist),
}));

