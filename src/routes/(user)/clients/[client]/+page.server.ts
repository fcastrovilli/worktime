import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { clientsTable } from '$lib/server/schemas';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/signup');
	const client = await db.query.clientsTable.findFirst({
		where: eq(clientsTable.slug, params.client),
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
	return {
		client
	};
};
