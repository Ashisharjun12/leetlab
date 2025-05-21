CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error', 'internal_error');--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"problems_in_playlist" text[]
);
--> statement-breakpoint
CREATE TABLE "problem_in_playlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playlist_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "problem_solved" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"source_code" text NOT NULL,
	"std_in" text,
	"std_out" text,
	"std_err" text,
	"compile_out" text,
	"status" "status" DEFAULT 'pending',
	"memory" text,
	"time" text,
	"test_case_result" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_case_result" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"test_case" jsonb NOT NULL,
	"passed" boolean NOT NULL,
	"std_out" text,
	"expected_out" text,
	"std_err" text,
	"compile_out" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"memory" text,
	"time" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "problem" ADD COLUMN "company_id" uuid DEFAULT null;--> statement-breakpoint
ALTER TABLE "problem" ADD COLUMN "submissions" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "submissions" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "problems_solved" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "playlists" text[];--> statement-breakpoint
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_in_playlist" ADD CONSTRAINT "problem_in_playlist_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_in_playlist" ADD CONSTRAINT "problem_in_playlist_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_solved" ADD CONSTRAINT "problem_solved_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_solved" ADD CONSTRAINT "problem_solved_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_case_result" ADD CONSTRAINT "test_case_result_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_name_idx" ON "company" USING btree ("name");--> statement-breakpoint
CREATE INDEX "playlist_user_id_idx" ON "playlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "problem_in_playlist_playlist_id_problem_id_idx" ON "problem_in_playlist" USING btree ("playlist_id","problem_id");--> statement-breakpoint
CREATE INDEX "problem_solved_user_id_problem_id_idx" ON "problem_solved" USING btree ("user_id","problem_id");--> statement-breakpoint
CREATE INDEX "test_case_result_submission_id_idx" ON "test_case_result" USING btree ("submission_id");--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;