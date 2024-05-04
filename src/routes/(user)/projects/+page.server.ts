import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { createProjectSchema } from '$lib/zod-schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import { projectsTable } from '$lib/server/schemas.js';
import { eq } from 'drizzle-orm';

import { createProjectAction } from '$lib/server/crud/actions.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		with: {
			clients: true,
			worksessions: true
		}
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
	createProject: createProjectAction
};
