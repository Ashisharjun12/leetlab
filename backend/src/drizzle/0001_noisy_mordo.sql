ALTER TABLE "problem" ALTER COLUMN "companies" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "tags" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "tags" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "example" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "example" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "constraints" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "constraints" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "hints" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "test_cases" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "test_cases" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "submissions" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "code_snippets" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "code_snippets" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ALTER COLUMN "reference_solution" SET DEFAULT '{}'::jsonb;