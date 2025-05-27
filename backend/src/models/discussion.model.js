
import { index, pgEnum } from 'drizzle-orm/pg-core';
export const voteType = pgEnum('vote_type', ['up', 'down']);

// discussion.model.js
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { problem } from './problem.model.js';
import { user } from './user.model.js';


export const discussion = pgTable('discussion', {
  id: uuid('id').primaryKey().defaultRandom(),
  problemId: uuid('problem_id').references(() => problem.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const discussionRelations = relations(discussion, ({ many, one }) => ({
  problem: one(problem, {
    fields: [discussion.problemId],
    references: [problem.id],
  }),
  user: one(user, {
    fields: [discussion.userId],
    references: [user.id],
  }),
  comments: many(comment),
  votes: many(discussionVote),
}));

export const discussionVote = pgTable('discussion_vote', {
  discussionId: uuid('discussion_id').references(() => discussion.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  vote: voteType('vote').notNull(),
}, (table) => [
    {
  pk: index({ columns: [table.discussionId, table.userId] })
}]);

export const discussionVoteRelations = relations(discussionVote, ({ one }) => ({
  discussion: one(discussion, {
    fields: [discussionVote.discussionId],
    references: [discussion.id],
  }),
  user: one(user, {
    fields: [discussionVote.userId],
    references: [user.id],
  }),
}));

