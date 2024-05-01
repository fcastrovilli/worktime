import { z } from 'zod';

export const formSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(50, "Name can't be more than 50 characters"),
	email: z.string().email({ message: 'Please enter a valid email' }).nullable(),
	website: z.string().url({ message: 'Please enter a valid URL' }).nullable(),
	details: z.string().max(500, "Details can't be more than 500 characters").nullable()
});

export type FormSchema = typeof formSchema;
