import { db } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { clientsTable } from '$lib/server/schemas.js';
import { generateId } from 'lucia';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const clients = await db.query.clientsTable.findMany({
		where: eq(clientsTable.user_id, locals.user.id)
	});
	return {
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
			await db.insert(clientsTable).values({
				id: generateId(15),
				user_id: event.locals.user.id,
				...form.data,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (error) {
			return fail(400, { form });
		}

		return {
			form,
			client_name: form.data.name
		};
	}
};
