CREATE TYPE "public"."problem_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "problem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "problem_difficulty" DEFAULT 'easy' NOT NULL,
	"tags" text[] NOT NULL,
	"example" jsonb NOT NULL,
	"constraints" text[] NOT NULL,
	"hints" text,
	"editorial" text,
	"test_cases" jsonb NOT NULL,
	"code_snippets" jsonb NOT NULL,
	"reference_solution" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "problems" text[];--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;