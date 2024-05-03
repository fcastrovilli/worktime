import { z } from 'zod';

export const formSchema = z.object({
	name: z
		.string()
		.min(1, 'Name must be at least 1 characters')
		.max(50, "Name can't be more than 50 characters"),
	description: z.string().max(1000, "Description can't be more than 1000 characters").nullable(),
	deadline: z.string().nullable(),
	client: z.string().min(15, 'Invalid client').max(15, 'Invalid client')
});

export type FormSchema = typeof formSchema;
