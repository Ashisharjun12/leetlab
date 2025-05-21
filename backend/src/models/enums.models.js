import { pgEnum } from "drizzle-orm/pg-core";

export const userRoles = pgEnum("user_roles", ["user", "admin"]);

export const problemDifficulty = pgEnum("problem_difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const status = pgEnum("status", [
  "pending",
  "accepted",
  "wrong_answer",
  "time_limit_exceeded",
  "memory_limit_exceeded",
  "runtime_error",
  "compilation_error",
  "internal_error",
]);
