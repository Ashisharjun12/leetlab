CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"job_position" text NOT NULL,
	"job_description" text NOT NULL,
	"interview_type" text NOT NULL,
	"generated_questions" jsonb DEFAULT '[]'::jsonb,
	"feedback" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;