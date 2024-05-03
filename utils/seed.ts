import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/schemas';
import { generateIdFromEntropySize } from 'lucia';
import { faker } from '@faker-js/faker';
import slugify from 'slugify';

const sql = neon(process.env.DATABASE_URL as string);

const db = drizzle(sql, {
	schema
});

const main = async () => {
	try {
		console.log('Seeding database 🌱');
		// Delete all data
		await db.delete(schema.sessionsTable);
		await db.delete(schema.worksessionsTable);
		await db.delete(schema.projectsTable);
		await db.delete(schema.clientsTable);
		await db.delete(schema.usersTable);

		const users: schema.User[] = [];
		const clients: schema.Client[] = [];
		const projects: schema.Project[] = [];
		const worksessions: schema.Worksession[] = [];

		for (let i = 0; i < 3; i++) {
			const userId = generateIdFromEntropySize(10);
			users.push({
				id: userId,
				username: faker.person.firstName(),
				github_id: faker.number.int(15),
				fullname: faker.person.fullName(),
				avatar: faker.image.avatarGitHub(),
				createdAt: faker.date.anytime(),
				updatedAt: faker.date.anytime()
			});
			for (let j = 0; j < 5; j++) {
				const clientId = generateIdFromEntropySize(10);
				const projectId = generateIdFromEntropySize(10);

				const randomWorksessions = Math.floor(Math.random() * 5);

				clients.push({
					id: clientId,
					name: faker.company.name(),
					email: faker.internet.email(),
					details: faker.company.catchPhrase(),
					website: faker.internet.url(),
					slug: slugify(faker.company.name().toLowerCase()),
					user_id: userId,
					createdAt: faker.date.anytime(),
					updatedAt: faker.date.anytime()
				});

				projects.push({
					id: projectId,
					name: faker.company.name(),
					description: faker.lorem.paragraph(),
					deadline: faker.date.future(),
					slug: slugify(faker.company.name().toLowerCase()),
					client_id: clientId,
					user_id: userId,
					createdAt: faker.date.anytime(),
					updatedAt: faker.date.anytime()
				});

				for (let j = 0; j < randomWorksessions; j++) {
					worksessions.push({
						id: generateIdFromEntropySize(10),
						detail: faker.lorem.sentence(),
						start: faker.date.past(),
						end: faker.date.future(),
						project_id: projectId,
						client_id: clientId,
						user_id: userId,
						createdAt: faker.date.anytime(),
						updatedAt: faker.date.anytime()
					});
				}
			}
		}

		await db.insert(schema.usersTable).values(users);
		await db.insert(schema.clientsTable).values(clients);
		await db.insert(schema.projectsTable).values(projects);
		await db.insert(schema.worksessionsTable).values(worksessions);

		console.log('Seeding successful 🎉');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};

main();
