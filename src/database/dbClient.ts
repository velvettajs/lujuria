import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { DatabaseConfig } from "src/config/config.js";

const db: DbClient = drizzle(neon(DatabaseConfig.dbUrl));
export default db;
