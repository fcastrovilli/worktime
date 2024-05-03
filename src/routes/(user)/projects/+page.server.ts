import { db } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { projectsTable } from '$lib/server/schemas.js';
import { generateId } from 'lucia';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

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
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) throw redirect(302, '/signup');
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.insert(projectsTable).values({
				id: generateId(15),
				user_id: event.locals.user.id,
				name: form.data.name,
				description: form.data.description,
				client_id: form.data.client,
				slug: slugify(form.data.name).toLowerCase(),
				deadline: new Date(form.data.deadline ?? ''),
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (error) {
			return fail(400, { form });
		}

		return {
			form,
			project_name: form.data.name
		};
	}
};
