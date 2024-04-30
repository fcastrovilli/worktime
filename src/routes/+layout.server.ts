import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	await parent();
	return {
		user: locals.user || null
	};
};
