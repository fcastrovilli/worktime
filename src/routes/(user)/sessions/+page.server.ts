import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import { worksessionsTable, type WorksessionWithProjectsAndClients } from '$lib/server/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createWorksessionSchema } from '$lib/zod-schemas';
import { createWorksessionAction } from '$lib/server/crud/actions';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');

	const worksessions: WorksessionWithProjectsAndClients[] =
		await db.query.worksessionsTable.findMany({
			where: eq(worksessionsTable.user_id, locals.user.id),
			with: {
				projects: true,
				clients: true
			},
			orderBy: [desc(worksessionsTable.start)]
		});

	const projects = await db.query.projectsTable.findMany({
		where: eq(worksessionsTable.user_id, locals.user.id),
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
		worksessions,
		projects,
		form: await superValidate(zod(createWorksessionSchema))
	};
};

export const actions: Actions = {
	createWorksession: createWorksessionAction
};
