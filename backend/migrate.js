import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connection, db } from "./src/config/database.js";

(async () => {
  await migrate(db, { migrationsFolder: './src/drizzle' });
  await connection.end();
})(); 