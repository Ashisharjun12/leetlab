import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problem } from "./problem.model.js";
import { user } from "./user.model.js";

export const editorial = pgTable("editorial", {
  id: uuid("id").primaryKey(),
  videoUrl: jsonb("video_url", { length: 255 }),
  problemId: uuid("problem_id").references(() => problem.id, {
    onDelete: "cascade",
  }),
  userid: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  solutionContent: jsonb("solution_content").notNull(),
  createdAt: timestamp("updated_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
