import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/schemas';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/signup');
	}
	return {
		user: locals.user
	};
};

export const actions: Actions = {
	delete_account: async ({ locals, cookies }) => {
		if (!locals.user) {
			throw redirect(302, '/signup');
		}
		try {
			if (!locals.user_session) throw redirect(302, '/signup');
			const userId = locals.user.id;
			await lucia.invalidateUserSessions(userId);
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
			await db.delete(usersTable).where(eq(usersTable.id, userId));
		} catch (error) {
			console.log(error);
			throw fail(500);
		}
		throw redirect(302, '/signup');
	}
};
