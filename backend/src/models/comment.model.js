// comment.model.js
import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { discussion} from './discussion.model.js';
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
