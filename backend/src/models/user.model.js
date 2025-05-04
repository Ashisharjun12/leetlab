import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { problem } from './problem.model.js';
export const userRoles = pgEnum('user_roles', ['user', 'admin']);

export const user = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    avatar: jsonb('avatar'),
    password: text('password').notNull(),
    role: userRoles('role').notNull().default('user'),
    problems:text('problems').array(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});


