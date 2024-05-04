import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectsTable } from '$lib/server/schemas';
import { redirect } from '@sveltejs/kit';
// import { createClientAction } from '$lib/server/crud/actions';
// import { superValidate } from 'sveltekit-superforms';
// import { zod } from 'sveltekit-superforms/adapters';
// import { createClientSchema } from '$lib/zod-schemas';

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
		// form: await superValidate(zod(createWorksessionSchema))
	};
};

// export const actions: Actions = {
// 	createWorksession: createWorksessionAction
// };
