import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { createProjectSchema } from '$lib/zod-schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import { projectsTable } from '$lib/server/schemas.js';
import { asc, eq } from 'drizzle-orm';

import { createProjectAction, deleteProjectAction } from '$lib/server/crud/actions.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		with: {
			clients: true,
			worksessions: true
		},
		orderBy: [asc(projectsTable.deadline)]
	});
	const clients = await db.query.clientsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		columns: {
			id: true,
			name: true,
			slug: true
		}
	});
	return {
		projects,
		clients,
		form: await superValidate(zod(createProjectSchema))
	};
};

export const actions: Actions = {
	createProject: createProjectAction,
	deleteProject: deleteProjectAction
};
