<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { createWorksessionSchema, type CreateWorksession } from '$lib/zod-schemas.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import HourPicker from './hour_picker.svelte';

	export let data: SuperValidated<Infer<CreateWorksession>>;
	let open = false;

	const form = superForm(data, {
		validators: zodClient(createWorksessionSchema),
		taintedMessage: null,
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Session created successfully!', {
					description: result.data?.worksession_name,
					position: 'bottom-left'
				});
			} else {
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
	title="New Worksession"
	description="Here you can create a new worksession. Click 'Create' when you're done."
>
	<Plus slot="trigger" size={35} />
	<div slot="form">
		<form method="POST" action="?/createWorksession" use:enhance>
			<HourPicker {form} />
			<Form.Field {form} name="details">
				<Form.Control let:attrs>
					<Form.Label>Details</Form.Label>
					<Textarea
						{...attrs}
						placeholder="Add any additional detail about the worksession."
						bind:value={$formData.details}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="mt-4 w-full">Create</Form.Button>
		</form>
	</div>
</Panel>
