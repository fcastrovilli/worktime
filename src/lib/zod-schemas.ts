import { z } from 'zod';

export const upsertClientSchema = z.object({
	id: z.string().min(15, 'Invalid client').max(15, 'Invalid client').nullable(),
	name: z
		.string()
		.min(1, 'Name must be at least 1 characters')
		.max(50, "Name can't be more than 50 characters"),
	email: z.string().email({ message: 'Please enter a valid email' }).nullable(),
	website: z.string().url({ message: 'Please enter a valid URL' }).nullable(),
	currency: z
		.string()
		.min(3, 'Currency must be at least 3 characters')
		.max(3, 'Currency must be at most 3 characters')
		.nullable(),
	details: z.string().max(500, "Details can't be more than 500 characters").nullable()
});

export const upsertProjectSchema = z.object({
	id: z.string().min(15, 'Invalid project').max(15, 'Invalid project').nullable(),
	name: z
		.string()
		.min(1, 'Name must be at least 1 characters')
		.max(50, "Name can't be more than 50 characters"),
	description: z.string().max(1000, "Description can't be more than 1000 characters").nullable(),
	deadline: z.string().nullable(),
	budget: z.number().nullable(),
	pricehour: z.number().nullable(),
	amountpaid: z.number().nullable(),
	status: z.enum(['inactive', 'active', 'unpaid', 'paid']).nullable(),
	client: z.string().min(15, 'Invalid client').max(15, 'Invalid client')
});

export const upsertSessionSchema = z.object({
	id: z.string().min(15, 'Invalid session').max(15, 'Invalid session').nullable(),
	start: z.string(),
	end: z.string().nullable(),
	duration: z.number().nullable(),
	pricehour: z.number().nullable(),
	details: z.string().max(1000, "Details field can't be more than 1000 characters").nullable(),
	project: z.string().min(15, 'Invalid project').max(15, 'Invalid project'),
	client: z.string().min(15, 'Invalid client').max(15, 'Invalid client')
});

export type UpsertProject = typeof upsertProjectSchema;
export type UpsertClient = typeof upsertClientSchema;
export type UpsertSession = typeof upsertSessionSchema;
