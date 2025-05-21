import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./user.model.js";
import { problem } from "./problem.model.js";
import { relations } from "drizzle-orm";


export const playlist = pgTable('playlist', {
    id:uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    problemsInPlaylist:text('problems_in_playlist').array(),

},(t)=>[
    index('playlist_user_id_idx').on(t.userId)
])

//relations
export const playlistRelations = relations(playlist, ({ one,many }) => ({
    user: one(user, {
        fields: [playlist.userId],
        references: [user.id],
    }),
    problems: many(problem),
}));
