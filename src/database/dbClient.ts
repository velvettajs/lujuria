import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { DatabaseConfig } from '../config/config';

const db = drizzle(neon(DatabaseConfig.dbUrl));

export default db;