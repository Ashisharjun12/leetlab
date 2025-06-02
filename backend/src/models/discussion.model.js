
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
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





