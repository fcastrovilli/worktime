import * as schema from './schemas';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new pg.Pool({ connectionString: DATABASE_URL });

export const db = drizzle(pool, { schema });

export type Database = typeof db;

export const adapter = new DrizzlePostgreSQLAdapter(
	db,
	schema.userSessionsTable,
	schema.usersTable
);
