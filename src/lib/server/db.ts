import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import * as schema from './schemas';

import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

import { DATABASE_URL } from '$env/static/private';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

export type Database = typeof db;

export const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessionsTable, schema.usersTable);
