import { sql, type InferSelectModel } from 'drizzle-orm';
import { text, integer, sqliteTable, SQLiteAsyncDialect } from 'drizzle-orm/sqlite-core';

const timestamps = {
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
};

export const usersTable = sqliteTable('user', {
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
export const sessionsTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: integer('expires_at').notNull()
});

export type User = InferSelectModel<typeof usersTable>;
export const sqliteDialect = new SQLiteAsyncDialect();
