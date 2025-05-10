import { pgTable, uuid } from "drizzle-orm/pg-core";





export const submission = pgTable("submission",{
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
})