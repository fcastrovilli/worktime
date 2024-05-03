<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';

	export let data: SuperValidated<Infer<FormSchema>>;
	let open = false;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Client created successfully!', {
					description: result.data?.client_name,
					position: 'bottom-left'
				});
			} else {
				console.log(result);
				toast.error('Please fix the errors in the form.', {
					position: 'bottom-left'
				});
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title="New Client"
	description="Here you can create a new client profile. Click 'Create' when you're done."
>
	<Plus slot="trigger" size={35} />
	<div slot="form">
		<form method="POST" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Client Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.Description>This is used to identify the client.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="website">
				<Form.Control let:attrs>
					<Form.Label>Website</Form.Label>
					<Input {...attrs} bind:value={$formData.website} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="details">
				<Form.Control let:attrs>
					<Form.Label>Details</Form.Label>
					<Textarea
						{...attrs}
						placeholder="Add any additional details about the client."
						bind:value={$formData.details}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="mt-4 w-full">Create</Form.Button>
		</form>
	</div>
</Panel>
