import * as schema from '../src/lib/server/schemas';

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const client = new pg.Client({
	connectionString: process.env.DATABASE_URL!
});

await client.connect();
const db = drizzle(client, { schema });

const main = async () => {
	try {
		// Delete all data
		await db.delete(schema.sessionsTable);
		await db.delete(schema.projectsTable);
		await db.delete(schema.clientsTable);
		await db.delete(schema.usersTable);

		await client.end();
		console.log('Database cleared successfully 🗑️');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to clear database 💥');
	}
};

main();
