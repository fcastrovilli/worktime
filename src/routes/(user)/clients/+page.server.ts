import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { createClientSchema } from '$lib/zod-schemas.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { clientsTable } from '$lib/server/schemas.js';
import { eq } from 'drizzle-orm';
import { createClientAction } from '$lib/server/crud/actions.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const clients = await db.query.clientsTable.findMany({
		where: eq(clientsTable.user_id, locals.user.id),
		with: {
			projects: true
		}
	});
	return {
		clients,
		form: await superValidate(zod(createClientSchema))
	};
};

export const actions: Actions = {
	createClient: createClientAction
};
