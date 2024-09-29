import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schemas.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		database: process.env.POSTGRES_DB!,
		host: process.env.POSTGRES_HOST!,
		port: 5432,
		user: process.env.POSTGRES_USER!,
		password: process.env.POSTGRES_PASSWORD!,
		ssl: false
	}
} satisfies Config;
