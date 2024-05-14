import { db } from '../db';
import { clientsTable, projectsTable, sessionsTable } from '../schemas';
import { generateId } from 'lucia';
import {
	upsertClientSchema,
	createProjectSchema,
	createSessionSchema,
	upsertProjectSchema
} from '$lib/zod-schemas';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import slugify from 'slugify';
import { and, eq } from 'drizzle-orm';

export async function upsertClientAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(upsertClientSchema));
	if (!form.valid) {
		return fail(400, {
			upsertClientForm: form
		});
	}
	const slug = slugify(form.data.name).toLowerCase();
	try {
		const client = await db.query.clientsTable.findFirst({
			where: and(
				eq(clientsTable.user_id, event.locals.user.id),
				eq(clientsTable.id, form.data.id ?? '')
			)
		});
		if (client) {
			await db
				.update(clientsTable)
				.set({
					slug: slug,
					name: form.data.name,
					details: form.data.details,
					email: form.data.email,
					website: form.data.website,
					updatedAt: new Date()
				})
				.where(
					and(
						eq(clientsTable.user_id, event.locals.user.id),
						eq(clientsTable.id, form.data.id ?? '')
					)
				);
		} else {
			await db.insert(clientsTable).values({
				id: generateId(15),
				user_id: event.locals.user.id,
				slug: slug,
				name: form.data.name,
				details: form.data.details,
				email: form.data.email,
				website: form.data.website,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}
	} catch (error) {
		console.log(error);
		return fail(400, { upsertClientForm: form });
	}

	return {
		upsertClientForm: form,
		client_name: form.data.name,
		client_slug: slug
	};
}

export async function upsertProjectAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(upsertProjectSchema));
	if (!form.valid) {
		return fail(400, {
			upsertProjectForm: form
		});
	}

	const slug = slugify(form.data.name).toLowerCase();
	try {
		const project = await db.query.projectsTable.findFirst({
			where: and(
				eq(projectsTable.user_id, event.locals.user.id),
				eq(projectsTable.id, form.data.id ?? '')
			)
		});
		if (project) {
			await db
				.update(projectsTable)
				.set({
					name: form.data.name,
					description: form.data.description,
					slug: slug,
					client_id: form.data.client,
					deadline: form.data.deadline ? new Date(form.data.deadline) : null,
					updatedAt: new Date()
				})
				.where(
					and(
						eq(projectsTable.user_id, event.locals.user.id),
						eq(projectsTable.id, form.data.id ?? '')
					)
				);
		} else {
			await db.insert(projectsTable).values({
				id: generateId(15),
				user_id: event.locals.user.id,
				name: form.data.name,
				description: form.data.description,
				client_id: form.data.client,
				slug: slug,
				deadline: form.data.deadline ? new Date(form.data.deadline) : null,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}
	} catch (error) {
		return fail(400, { upsertProjectForm: form });
	}

	return {
		upsertProjectForm: form,
		project_name: form.data.name,
		project_slug: slug
	};
}

export async function createProjectAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(createProjectSchema));
	if (!form.valid) {
		return fail(400, {
			createProjectForm: form
		});
	}

	try {
		await db.insert(projectsTable).values({
			id: generateId(15),
			user_id: event.locals.user.id,
			name: form.data.name,
			description: form.data.description,
			client_id: form.data.client,
			slug: slugify(form.data.name).toLowerCase(),
			deadline: form.data.deadline ? new Date(form.data.deadline) : null,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	} catch (error) {
		return fail(400, { createProjectForm: form });
	}

	return {
		createProjectForm: form,
		project_name: form.data.name
	};
}

export async function createSessionAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(createSessionSchema));
	if (!form.valid) {
		return fail(400, {
			createSessionForm: form
		});
	}
	try {
		await db.insert(sessionsTable).values({
			id: generateId(15),
			user_id: event.locals.user.id,
			project_id: form.data.project,
			client_id: form.data.client,
			start: new Date(form.data.start),
			end: form.data.end ? new Date(form.data.end) : null,
			details: form.data.details,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	} catch (error) {
		return fail(400, { createSessionForm: form });
	}

	return {
		createSessionForm: form,
		session_name: form.data.details
	};
}

export async function deleteSessionAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await event.request.formData();
	const id = form.get('id') as string;
	if (!id) throw fail(400, { message: 'Invalid id' });
	const session = await db.query.sessionsTable.findFirst({
		where: and(eq(sessionsTable.user_id, event.locals.user.id), eq(sessionsTable.id, id))
	});
	if (!session || session.user_id !== event.locals.user.id) {
		return fail(401, {
			message: 'You are not allowed to delete this session.'
		});
	}
	await db
		.delete(sessionsTable)
		.where(and(eq(sessionsTable.id, id), eq(sessionsTable.user_id, event.locals.user.id)));
	return {
		message: 'Session deleted.'
	};
}

export async function deleteProjectAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await event.request.formData();
	const id = form.get('id') as string;
	if (!id) throw fail(400, { message: 'Invalid id' });
	const project = await db.query.projectsTable.findFirst({
		where: and(eq(projectsTable.user_id, event.locals.user.id), eq(projectsTable.id, id))
	});
	if (!project || project.user_id !== event.locals.user.id) {
		return fail(401, {
			message: 'You are not allowed to delete this project.'
		});
	}
	await db
		.delete(sessionsTable)
		.where(and(eq(sessionsTable.project_id, id), eq(sessionsTable.user_id, event.locals.user.id)));
	await db
		.delete(projectsTable)
		.where(and(eq(projectsTable.id, id), eq(projectsTable.user_id, event.locals.user.id)));
	return {
		message: `${project.name} deleted.`
	};
}

export async function deleteClientAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await event.request.formData();
	const id = form.get('id') as string;
	if (!id) throw fail(400, { message: 'Invalid id' });
	const client = await db.query.clientsTable.findFirst({
		where: and(eq(clientsTable.user_id, event.locals.user.id), eq(clientsTable.id, id))
	});
	if (!client || client.user_id !== event.locals.user.id) {
		return fail(401, {
			message: 'You are not allowed to delete this client.'
		});
	}
	await db
		.delete(sessionsTable)
		.where(and(eq(sessionsTable.client_id, id), eq(sessionsTable.user_id, event.locals.user.id)));
	await db
		.delete(projectsTable)
		.where(and(eq(projectsTable.client_id, id), eq(projectsTable.user_id, event.locals.user.id)));
	await db
		.delete(clientsTable)
		.where(and(eq(clientsTable.id, id), eq(clientsTable.user_id, event.locals.user.id)));
	return {
		message: `${client.name} deleted.`
	};
}

// export async function updatePostAction(event: RequestEvent) {
// 	if (!event.locals.user) redirect(302, '/login');
// 	const form = await superValidate(event, zod(updatePostSchema));
// 	if (!form.valid) return fail(400, { updatePostForm: form });

// 	const postId = event.url.searchParams.get('id');
// 	if (!postId) error(400, 'Invalid postId');
// 	const post = await getPostById(postId, event.locals.user.id);

// 	if (!post || post.userId !== event.locals.user.id) {
// 		error(401, 'You are not allowed to delete this post.');
// 	}

// 	await db.update(postsTable).set(form.data).where(eq(postsTable.id, postId));

// 	return { updatePostForm: form };
// }
