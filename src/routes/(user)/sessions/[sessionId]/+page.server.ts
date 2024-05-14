import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';
import { projectsTable, sessionsTable } from '$lib/server/schemas';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { upsertSessionSchema } from '$lib/zod-schemas';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const session = await db.query.sessionsTable.findFirst({
		where: and(eq(sessionsTable.user_id, locals.user.id), eq(sessionsTable.id, params.sessionId)),
		with: {
			projects: true,
			clients: true
		}
	});
	if (!session) throw redirect(302, '/sessions');
	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.user_id, locals.user.id),
		with: {
			clients: true
		}
	});
	return {
		session,
		projects,
		upsertSessionForm: await superValidate(undefined, zod(upsertSessionSchema))
	};
};
