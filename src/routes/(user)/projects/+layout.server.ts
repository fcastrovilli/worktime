import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projectsTable } from '$lib/server/schemas';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { upsertProjectSchema } from '$lib/zod-schemas';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const clients = await db.query.clientsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		columns: {
			id: true,
			name: true,
			slug: true
		}
	});
	return {
		clients,
		upsertProject: await superValidate(zod(upsertProjectSchema))
	};
};
