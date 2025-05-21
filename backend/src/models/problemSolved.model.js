import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./user.model.js";
import { problem } from "./problem.model.js";
import { relations } from "drizzle-orm";



export const problemSolved = pgTable('problem_solved', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    problemId: uuid('problem_id').references(() => problem.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
},(t)=>[
    index('problem_solved_user_id_problem_id_idx').on(t.userId,t.problemId)
])

//relations
export const problemSolvedRelations = relations(problemSolved, ({ one }) => ({
    user: one(user, {
        fields: [problemSolved.userId],
        references: [user.id],
    }),
    problem: one(problem, {
        fields: [problemSolved.problemId],
        references: [problem.id],
    }),
}));
