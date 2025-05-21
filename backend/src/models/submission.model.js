import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./user.model.js";
import { problem } from "./problem.model.js";
import { status } from "./enums.models.js";
import { relations } from "drizzle-orm";
import { testCaseResult } from "./testCaseResult.model.js";




export const submission = pgTable("submission",{
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    problemId: uuid('problem_id').references(() => problem.id, { onDelete: 'cascade' }).notNull(),
    sourceCode: text('source_code').notNull(),
    stdIn: text('std_in'),  
    stdOut: text('std_out'),
    stdErr: text('std_err'),
    compileOut: text('compile_out'),
    status: status('status').default('pending'),
    memory: text('memory'),
    time: text('time'),
    testCaseResult: jsonb('test_case_result'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})


//relations
export const submissionRelations = relations(submission, ({ one }) => ({
    user: one(user, {
        fields: [submission.userId],
        references: [user.id],
    }),
    problem: one(problem, {
        fields: [submission.problemId],
        references: [problem.id],
    }),
    testCaseResults: many(testCaseResult),
}));
