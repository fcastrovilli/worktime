import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import { sessionsTable, type SessionWithProjectsAndClients } from '$lib/server/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createSessionSchema } from '$lib/zod-schemas';
import { createSessionAction, deleteSessionAction } from '$lib/server/crud/actions';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');

	const sessions: SessionWithProjectsAndClients[] = await db.query.sessionsTable.findMany({
		where: eq(sessionsTable.user_id, locals.user.id),
		with: {
			projects: true,
			clients: true
		},
		orderBy: [desc(sessionsTable.start)]
	});

	const projects = await db.query.projectsTable.findMany({
		where: eq(sessionsTable.user_id, locals.user.id),
		with: {
			clients: {
				columns: {
					id: true,
					name: true,
					slug: true
				}
			}
		},
		columns: {
			id: true,
			name: true,
			slug: true
		}
	});

	return {
		sessions,
		projects,
		createSessionForm: await superValidate(undefined, zod(createSessionSchema))
	};
};

export const actions: Actions = {
	createSession: createSessionAction,
	deleteSession: deleteSessionAction
};
