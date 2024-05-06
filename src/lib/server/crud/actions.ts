import { db } from '../db';
import { clientsTable, projectsTable, worksessionsTable } from '../schemas';
import { generateId } from 'lucia';
import { createClientSchema, createProjectSchema, createWorksessionSchema } from '$lib/zod-schemas';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import slugify from 'slugify';

export async function createClientAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(createClientSchema));
	if (!form.valid) {
		return fail(400, {
			createClientForm: form
		});
	}
	try {
		await db.insert(clientsTable).values({
			id: generateId(15),
			user_id: event.locals.user.id,
			slug: slugify(form.data.name).toLowerCase(),
			...form.data,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	} catch (error) {
		return fail(400, { createClientForm: form });
	}

	return {
		createClientForm: form,
		client_name: form.data.name
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

export async function createWorksessionAction(event: RequestEvent) {
	if (!event.locals.user) throw redirect(302, '/signup');
	const form = await superValidate(event, zod(createWorksessionSchema));
	if (!form.valid) {
		return fail(400, {
			createWorksessionForm: form
		});
	}
	try {
		await db.insert(worksessionsTable).values({
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
		return fail(400, { createWorksessionForm: form });
	}

	return {
		createWorksessionForm: form,
		worksession_name: form.data.details
	};
}

// export async function deletePostAction(event: RequestEvent) {
// 	if (!event.locals.user) redirect(302, '/login');
// 	const form = await superValidate(event.url, zod(deletePostSchema));

// 	if (!form.valid) {
// 		setError(form, '', 'Error deleting post');
// 		return {
// 			deletePostForm: form
// 		};
// 	}

// 	const post = await getPostById(form.data.id, event.locals.user.id);

// 	if (!post || post.userId !== event.locals.user.id) {
// 		error(401, 'You are not allowed to delete this post.');
// 	}

// 	await db.delete(postsTable).where(eq(postsTable.id, form.data.id));

// 	return {
// 		deletePostForm: form
// 	};
// }

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
