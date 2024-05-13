import { relations, type InferSelectModel } from 'drizzle-orm';

import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

const timestamps = {
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow()
};

export const usersTable = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull(),
	github_id: integer('github_id').notNull(),
	fullname: text('fullname'),
	avatar: text('avatar'),
	...timestamps
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	clients: many(clientsTable),
	worksessions: many(worksessionsTable),
	projects: many(projectsTable)
}));

/**
 * Sessions are used to store the user's session information.
 */
export const sessionsTable = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const clientsTable = pgTable('client', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	email: text('email').unique(),
	details: text('details'),
	website: text('website'),
	slug: text('slug').notNull().unique(),
	user_id: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	...timestamps
});

export const clientsRelations = relations(clientsTable, ({ one, many }) => ({
	user: one(usersTable, { fields: [clientsTable.user_id], references: [usersTable.id] }),
	projects: many(projectsTable)
}));

export const worksessionsTable = pgTable('worksession', {
	id: text('id').notNull().primaryKey(),
	details: text('details'),
	start: timestamp('start', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	end: timestamp('end', {
		withTimezone: true,
		mode: 'date'
	}),
	project_id: text('project_id')
		.notNull()
		.references(() => projectsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	client_id: text('client_id')
		.notNull()
		.references(() => clientsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	...timestamps
});

export const worksessionsRelations = relations(worksessionsTable, ({ one }) => ({
	clients: one(clientsTable, {
		fields: [worksessionsTable.client_id],
		references: [clientsTable.id]
	}),
	projects: one(projectsTable, {
		fields: [worksessionsTable.project_id],
		references: [projectsTable.id]
	}),
	users: one(usersTable, { fields: [worksessionsTable.user_id], references: [usersTable.id] })
}));

export const projectsTable = pgTable('project', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	deadline: timestamp('deadline', {
		withTimezone: true,
		mode: 'date'
	}),
	slug: text('slug').notNull().unique(),
	client_id: text('client_id')
		.notNull()
		.references(() => clientsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	...timestamps
});

export const projectsRelations = relations(projectsTable, ({ many, one }) => ({
	worksessions: many(worksessionsTable),
	clients: one(clientsTable, { fields: [projectsTable.client_id], references: [clientsTable.id] }),
	users: one(usersTable, { fields: [projectsTable.user_id], references: [usersTable.id] })
}));

export type User = InferSelectModel<typeof usersTable>;
export type Client = InferSelectModel<typeof clientsTable>;
export type ClientWithProjects = Client & { projects: Project[] };
export type Project = InferSelectModel<typeof projectsTable>;
export type ProjectWithClients = Project & { clients: Client[] | Client };
export type ProjectWithWorksessions = Project & { worksessions: Worksession[] | Worksession };
export type ProjectWithClientsAndWorksessions = Project & { clients: Client[] | Client } & {
	worksessions: Worksession[] | Worksession;
};
export type Worksession = InferSelectModel<typeof worksessionsTable>;
export type WorksessionWithProjects = Worksession & { projects: Project[] | Project };
export type WorksessionWithClients = Worksession & { clients: Client[] | Client };
export type WorksessionWithProjectsAndClients = Worksession & { projects: Project[] | Project } & {
	clients: Client[] | Client;
};
