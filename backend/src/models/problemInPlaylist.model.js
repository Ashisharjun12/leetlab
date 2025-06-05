import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { playlist } from "./playlist.model.js";
import { problem } from "./problem.model.js";
import { relations } from "drizzle-orm";
import { user } from "./user.model.js";

export const problemInPlaylist = pgTable('problem_in_playlist', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId:uuid("user_id").references(()=>user.id,{onDelete:'cascade'}),
    playlistId: uuid('playlist_id').references(() => playlist.id, { onDelete: 'cascade' }).notNull(),
    problemId: uuid('problem_id').references(() => problem.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
},(t)=>[
    index('problem_in_playlist_playlist_id_problem_id_idx').on(t.playlistId,t.problemId)
])


//relations
export const problemInPlaylistRelations = relations(problemInPlaylist, ({ one,many }) => ({
    playlist: one(playlist, {
        fields: [problemInPlaylist.playlistId],
        references: [playlist.id],
    }),
    problem: one(problem, {
        fields: [problemInPlaylist.problemId],
        references: [problem.id],
    }),
}));