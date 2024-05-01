import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schemas.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL as string
	}
} satisfies Config;
