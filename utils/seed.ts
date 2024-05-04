import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../src/lib/server/schemas';
import { generateId, generateIdFromEntropySize } from 'lucia';
import { faker } from '@faker-js/faker';
import slugify from 'slugify';

const sql = neon(process.env.DATABASE_URL as string);

type DefaultUser = {
	username: string;
	github_id: number;
	fullname: string;
	avatar: string;
};

const defaultUser: DefaultUser = JSON.parse(process.env.DEFAULT_USER as string);

const db = drizzle(sql, {
	schema
});

const users: schema.User[] = [];
const clients: schema.Client[] = [];
const projects: schema.Project[] = [];
const worksessions: schema.Worksession[] = [];

const main = async () => {
	try {
		console.log('Clearing database 🗑️');
		// Delete all data
		await db.delete(schema.sessionsTable);
		await db.delete(schema.worksessionsTable);
		await db.delete(schema.projectsTable);
		await db.delete(schema.clientsTable);
		await db.delete(schema.usersTable);

		// Create default user
		if (defaultUser) {
			const defaultUserId = generateIdFromEntropySize(10);
			users.push({
				id: defaultUserId,
				username: defaultUser.username,
				github_id: defaultUser.github_id,
				fullname: defaultUser.fullname,
				avatar: defaultUser.avatar,
				createdAt: faker.date.anytime(),
				updatedAt: faker.date.anytime()
			});
			seedDB(defaultUserId);
		}

		// Create 5 users
		for (let i = 0; i < 5; i++) {
			const userId = generateIdFromEntropySize(10);
			users.push({
				id: userId,
				username: faker.person.firstName().toLowerCase(),
				github_id: Math.floor(Math.random() * 100000000),
				fullname: faker.person.fullName(),
				avatar: faker.image.avatarGitHub(),
				createdAt: faker.date.anytime(),
				updatedAt: faker.date.anytime()
			});

			seedDB(userId);
		}
		console.log('Seeding database 🌱');
		await db.insert(schema.usersTable).values(users);
		await db.insert(schema.clientsTable).values(clients);
		await db.insert(schema.projectsTable).values(projects);
		await db.insert(schema.worksessionsTable).values(worksessions);

		console.log('Seeding successful 🎉');
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database 💥');
	}
};

main();

function seedDB(userId: string) {
	// Create max 5 clients per user
	for (let j = 0; j < Math.floor(Math.random() * 5 + 1); j++) {
		const clientId = generateId(15);
		const clientName = faker.company.name();
		clients.push({
			id: clientId,
			name: clientName,
			email: faker.internet.email(),
			details: faker.company.catchPhrase(),
			website: faker.internet.url(),
			slug: slugify(clientName).toLowerCase(),
			user_id: userId,
			createdAt: faker.date.anytime(),
			updatedAt: faker.date.anytime()
		});

		// Create max 5 projects per client
		for (let j = 0; j < Math.floor(Math.random() * 5 + 1); j++) {
			const projectId = generateId(15);
			const projectName = faker.word.words({
				count: { min: 1, max: 4 }
			});
			projects.push({
				id: projectId,
				name: projectName,
				description: faker.lorem.paragraph(),
				deadline: faker.date.future(),
				slug: slugify(projectName).toLowerCase(),
				client_id: clientId,
				user_id: userId,
				createdAt: faker.date.anytime(),
				updatedAt: faker.date.anytime()
			});

			// Create max 5 worksessions per project
			for (let j = 0; j < Math.floor(Math.random() * 5 + 1); j++) {
				const start = faker.date.past();
				const end = new Date(start.getTime() + Math.floor(Math.random() * (24 * 60 * 60 * 1000)));

				worksessions.push({
					id: generateId(15),
					detail: faker.lorem.sentence(),
					start: start,
					end: end,
					project_id: projectId,
					client_id: clientId,
					user_id: userId,
					createdAt: start,
					updatedAt: end
				});
			}
		}
	}
}
