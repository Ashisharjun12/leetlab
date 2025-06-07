-- First, drop the existing foreign key constraint if it exists
ALTER TABLE "interviews" DROP CONSTRAINT IF EXISTS "interviews_user_id_users_id_fk";

-- Then alter the column type to UUID
ALTER TABLE "interviews" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;

-- Finally, add back the foreign key constraint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;