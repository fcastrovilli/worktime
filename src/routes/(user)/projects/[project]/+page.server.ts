import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectsTable } from '$lib/server/schemas';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const project = await db.query.projectsTable.findFirst({
		where: eq(projectsTable.slug, params.project),
		with: {
			clients: true,
			worksessions: true
		}
	});
	return {
		project
	};
};
