import { defineConfig } from "drizzle-kit";
import { _config } from "./src/config/config.js";

export default defineConfig({
  schema: './src/models/*.js',
  out: './src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: _config.DATABASE_URI
  }
}); 