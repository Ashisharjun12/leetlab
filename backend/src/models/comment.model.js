// comment.model.js
import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { discussion, voteType } from './discussion.model.js';
import { user } from './user.model.js';


export const comment = pgTable('comment', {
  id: uuid('id').primaryKey().defaultRandom(),
  discussionId: uuid('discussion_id').references(() => discussion.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  parentCommentId: uuid('parent_comment_id').references(() => comment.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const commentRelations = relations(comment, ({ many, one }) => ({
  discussion: one(discussion, {
    fields: [comment.discussionId],
    references: [discussion.id],
  }),
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  parentComment: one(comment, {
    fields: [comment.parentCommentId],
    references: [comment.id],
    relationName: 'comment_replies',
  }),
  replies: many(comment, {
    relationName: 'comment_replies',
  }),
  votes: many(commentVote),
}));

export const commentVote = pgTable('comment_vote', {
  commentId: uuid('comment_id').references(() => comment.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  vote: voteType('vote').notNull(),
}, (table) => [{
  pk: index({ columns: [table.commentId, table.userId] }),
}]);

export const commentVoteRelations = relations(commentVote, ({ one }) => ({
  comment: one(comment, {
    fields: [commentVote.commentId],
    references: [comment.id],
  }),
  user: one(user, {
    fields: [commentVote.userId],
    references: [user.id],
  }),
}));