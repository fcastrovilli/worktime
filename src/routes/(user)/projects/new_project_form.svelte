<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import FormDatePicker from './form_date_picker.svelte';

	type Client = {
		id: string;
		name: string;
		slug: string;
	};

	export let data: SuperValidated<Infer<FormSchema>>;
	export let clients: Client[];

	let open = false;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Project created successfully!', {
					description: result.data?.project_name,
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

	let selectedLabel: string | undefined;

	$: selectedClient = $formData.client
		? {
				label: selectedLabel,
				value: $formData.client
			}
		: undefined;
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title="New Project"
	description="Here you can create a new project. Click 'Create' when you're done."
>
	<Plus slot="trigger" size={35} />
	<div slot="form">
		<form method="POST" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Project Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.Description>This is used to identify the project.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="client">
				<Form.Control let:attrs>
					<Form.Label>Client</Form.Label>
					<Select.Root
						selected={selectedClient}
						onSelectedChange={(v) => {
							v && (($formData.client = v.value), (selectedLabel = v.label));
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select a client for this project." />
						</Select.Trigger>
						<Select.Content>
							{#each clients as client}
								<Select.Item value={client.id} label={client.name} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.client} name={attrs.name} />
				</Form.Control>
				<Form.Description>
					You can manage clients in your <a href="/clients">clients settings</a>.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<FormDatePicker {form} />

			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Textarea
						{...attrs}
						placeholder="Add any additional details about the project."
						bind:value={$formData.description}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="mt-4 w-full">Create</Form.Button>
		</form>
	</div>
</Panel>
