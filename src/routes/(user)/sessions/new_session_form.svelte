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
	import type { BasicProjectWithClients } from '$lib/basic_utils';
	import SelectProject from '$lib/components/crud/select_project.svelte';

	export let data: SuperValidated<Infer<CreateWorksession>>;
	export let projects: BasicProjectWithClients;
	let open = false;

	const form = superForm(data, {
		validators: zodClient(createWorksessionSchema),
		taintedMessage: null,
		dataType: 'json',
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

	$: {
		if ($formData.project) {
			$formData.client = projects.find((p) => p.id === $formData.project)?.clients.id ?? '';
		}
	}
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title="New Session"
	description="Here you can create a new worksession. Click 'Create' when you're done."
>
	<Plus slot="trigger" size={35} />
	<div slot="form">
		<form method="POST" action="?/createWorksession" use:enhance>
			<input type="hidden" name="client" value={$formData.client} />
			<Form.Field {form} name="project">
				<Form.Control let:attrs>
					<Form.Label>Project</Form.Label>
					<SelectProject {form} {projects} {attrs} />
				</Form.Control>
				<Form.Description>
					You can manage projects in your <a href="/projects">projects settings</a>.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
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
