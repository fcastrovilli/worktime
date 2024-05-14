import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	} else {
		throw redirect(303, '/signup');
	}
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.user_session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.user_session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/signup');
	}
};
