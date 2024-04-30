// src/lib/server/auth.ts
import { Lucia } from 'lucia';
import { adapter } from './db.js';
import { dev } from '$app/environment';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			github_id: attributes.github_id,
			username: attributes.username,
			fullname: attributes.fullname,
			avatar: attributes.avatar
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
	fullname: string;
	avatar: string;
}

import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
