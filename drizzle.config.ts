import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schemas.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
} satisfies Config;
