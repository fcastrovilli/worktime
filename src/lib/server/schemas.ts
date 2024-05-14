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
	sessions: many(sessionsTable),
	projects: many(projectsTable)
}));

/**
 * User Sessions are used to store the user's session information.
 */
export const userSessionsTable = pgTable('user_session', {
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
	sessions: many(sessionsTable),
	clients: one(clientsTable, { fields: [projectsTable.client_id], references: [clientsTable.id] }),
	users: one(usersTable, { fields: [projectsTable.user_id], references: [usersTable.id] })
}));

export const sessionsTable = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	details: text('details'),
	duration: integer('duration').notNull().default(0),
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

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	clients: one(clientsTable, {
		fields: [sessionsTable.client_id],
		references: [clientsTable.id]
	}),
	projects: one(projectsTable, {
		fields: [sessionsTable.project_id],
		references: [projectsTable.id]
	}),
	users: one(usersTable, { fields: [sessionsTable.user_id], references: [usersTable.id] })
}));

export type User = InferSelectModel<typeof usersTable>;
export type Client = InferSelectModel<typeof clientsTable>;
export type ClientWithProjects = Client & { projects: Project[] };
export type Project = InferSelectModel<typeof projectsTable>;
export type ProjectWithClients = Project & { clients: Client[] | Client };
export type ProjectWithSessions = Project & { sessions: Session[] | Session };
export type ProjectWithClientsAndSessions = Project & { clients: Client[] | Client } & {
	sessions: Session[] | Session;
};
export type Session = InferSelectModel<typeof sessionsTable>;
export type SessionWithProjects = Session & { projects: Project[] | Project };
export type SessionWithClients = Session & { clients: Client[] | Client };
export type SessionWithProjectsAndClients = Session & { projects: Project[] | Project } & {
	clients: Client[] | Client;
};
