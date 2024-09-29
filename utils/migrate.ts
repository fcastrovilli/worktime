import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
const client = new pg.Client({
	database: process.env.POSTGRES_DB!,
	host: process.env.POSTGRES_HOST!,
	port: 5432,
	user: process.env.POSTGRES_USER!,
	password: process.env.POSTGRES_PASSWORD!,
	ssl: false
});

await client.connect();
const db = drizzle(client);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: './migrations/'
		})
			.then(() => console.log('Migration successful 🎉'))
			.finally(async () => await client.end());
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();
