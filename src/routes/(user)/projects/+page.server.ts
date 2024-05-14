import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import { projectsTable } from '$lib/server/schemas.js';
import { asc, eq } from 'drizzle-orm';

import { deleteProjectAction, upsertProjectAction } from '$lib/server/crud/actions.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		with: {
			clients: true,
			sessions: true
		},
		orderBy: [asc(projectsTable.deadline)]
	});
	return {
		projects
	};
};

export const actions: Actions = {
	upsertProject: upsertProjectAction,
	deleteProject: deleteProjectAction
};
