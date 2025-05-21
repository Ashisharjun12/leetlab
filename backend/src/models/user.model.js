import { pgTable, uuid, text, timestamp, jsonb} from 'drizzle-orm/pg-core';
import { userRoles } from './enums.models.js';

export const user = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    avatar: jsonb('avatar'),
    password: text('password').notNull(),
    role: userRoles('role').notNull().default('user'), 
    problems:text('problems').array(),
    submissions:text('submissions').array(),
    problemsSolved:text('problems_solved').array(),
    playlists:text('playlists').array(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});



