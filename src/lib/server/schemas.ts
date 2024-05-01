import type { InferSelectModel } from 'drizzle-orm';

import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

const timestamps = {
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
};

export const usersTable = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull(),
	github_id: integer('github_id').notNull(),
	fullname: text('fullname'),
	avatar: text('avatar'),
	...timestamps
});

/**
 * Sessions are used to store the user's session information.
 */
export const sessionsTable = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type User = InferSelectModel<typeof usersTable>;
