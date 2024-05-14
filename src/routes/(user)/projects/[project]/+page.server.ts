import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectsTable } from '$lib/server/schemas';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { upsertSessionSchema } from '$lib/zod-schemas';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const project = await db.query.projectsTable.findFirst({
		where: and(eq(projectsTable.slug, params.project), eq(projectsTable.user_id, locals.user.id)),
		with: {
			clients: true,
			sessions: {
				orderBy: (sessions, { desc }) => [desc(sessions.end)]
			}
		}
	});
	if (!project) throw redirect(302, '/projects');
	return {
		project,
		upsertSessionForm: await superValidate(undefined, zod(upsertSessionSchema))
	};
};
