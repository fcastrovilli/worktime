import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { clientsTable } from '$lib/server/schemas';
import { redirect, type Actions } from '@sveltejs/kit';
import { createProjectSchema } from '$lib/zod-schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createProjectAction } from '$lib/server/crud/actions';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const client = await db.query.clientsTable.findFirst({
		where: and(eq(clientsTable.slug, params.client), eq(clientsTable.user_id, locals.user.id)),
		with: {
			projects: {
				with: {
					worksessions: {
						columns: {
							id: true,
							start: true,
							end: true
						}
					}
				},
				columns: {
					id: true,
					slug: true,
					name: true,
					deadline: true
				}
			}
		}
	});
	if (!client) throw redirect(302, '/clients');
	return {
		client,
		createProjectForm: await superValidate(zod(createProjectSchema))
	};
};

export const actions: Actions = {
	createProject: createProjectAction
};
