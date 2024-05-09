import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
const client = new pg.Client({
	connectionString: process.env.DATABASE_URL as string
});

await client.connect();
const db = drizzle(client);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: './drizzle/'
		})
			.then(() => console.log('Migration successful 🎉'))
			.finally(async () => await client.end());
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();
