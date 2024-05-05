import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import { worksessionsTable } from '$lib/server/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createWorksessionSchema } from '$lib/zod-schemas';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/signup');

	const worksessions = await db.query.worksessionsTable.findMany({
		where: eq(worksessionsTable.user_id, locals.user.id),
		orderBy: [desc(worksessionsTable.start)]
	});

	return {
		worksessions,
		form: await superValidate(zod(createWorksessionSchema))
	};
};
