import { pgTable, uuid, text, timestamp, boolean, jsonb, index} from "drizzle-orm/pg-core";
import { submission } from "./submission.model.js";
import { status } from "./enums.models.js";
import { relations } from "drizzle-orm";

export const testCaseResult = pgTable('test_case_result', {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionId: uuid('submission_id')
        .references(() => submission.id, { onDelete: 'cascade' })
        .notNull(),
    testCase: jsonb('test_case').notNull(), 
    passed: boolean('passed').notNull(),
    stdOut: text('std_out'),
    expectedOut: text('expected_out'),
    stdErr: text('std_err'),
    compileOut: text('compile_out'),
    status: status('status').default('pending').notNull(), 
    memory: text('memory'),
    time: text('time'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (t) => [
    index('test_case_result_submission_id_idx').on(t.submissionId)
]);

//relations
export const testCaseResultRelations = relations(testCaseResult, ({ one }) => ({
    submission: one(submission, {
        fields: [testCaseResult.submissionId],
        references: [submission.id],
    }),
}));


