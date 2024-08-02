import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { DatabaseConfig } from "/config/config.js";

const db: DbType = drizzle(neon(DatabaseConfig.dbUrl));
export default db;
