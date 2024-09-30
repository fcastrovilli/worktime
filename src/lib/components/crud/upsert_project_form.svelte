<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { upsertProjectSchema, type UpsertProject } from '$lib/zod-schemas.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import DeadlineDatePicker from './deadline_date_picker.svelte';
	import type { BasicType } from '$lib/basic_utils';
	import SelectClient from '$lib/components/crud/select_client.svelte';
	import type {
		Project,
		ProjectWithClients,
		ProjectWithClientsAndSessions,
		ProjectWithSessions
	} from '$lib/server/schemas';
	import { type DateValue, CalendarDate } from '@internationalized/date';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { NumberInput } from '../ui/numberinput';
	import SelectStatus from './select_status.svelte';

	export let project:
		| Project
		| ProjectWithClients
		| ProjectWithClientsAndSessions
		| ProjectWithSessions
		| undefined = undefined;
	export let data: SuperValidated<Infer<UpsertProject>>;
	export let clients: BasicType | BasicType[];

	export let open = false;

	const slug = $page.params.project;

	const form = superForm(data, {
		validators: zodClient(upsertProjectSchema),
		taintedMessage: null,
		resetForm: false,
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success(project ? 'Project updated successfully!' : 'Project created successfully!', {
					description: result.data?.project_name,
					position: 'bottom-right'
				});
				if (result.data?.project_slug !== slug) {
					setTimeout(() => {
						goto(`/projects/${result.data?.project_slug}`);
					}, 100);
				}
			} else {
				toast.error('Please fix the errors in the form.', {
					position: 'bottom-right'
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(() => {
		if (project) {
			const deadline: DateValue | undefined = project.deadline
				? new CalendarDate(
						project.deadline.getFullYear(),
						project.deadline.getMonth(),
						project.deadline.getDate()
					)
				: undefined;
			$formData = {
				id: project.id,
				name: project.name,
				description: project.description,
				deadline: deadline?.toString() ?? null,
				client: project.client_id,
				budget: project.budget,
				pricehour: project.pricehour,
				amountpaid: project.amountpaid,
				status: project.status
			};
		} else {
			$formData.budget = 0;
			$formData.pricehour = 0;
			$formData.amountpaid = 0;
			$formData.status = 'inactive';
		}
	});
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title={project ? 'Update Project' : 'New Project'}
	description={project
		? "Here you can update a project. Click 'Update' when you're done."
		: "Here you can create a new project. Click 'Create' when you're done."}
>
	<slot name="trigger" slot="trigger">
		<Plus size={35} />
	</slot>
	<div slot="form">
		<form method="POST" action="/projects?/upsertProject" use:enhance>
			<input type="hidden" name="id" value={$formData.id} />
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
					<SelectClient {form} {clients} {attrs} />
				</Form.Control>
				<Form.Description>
					You can manage clients in your <a href="/clients">clients page</a>.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<DeadlineDatePicker {form} />
			<Form.Field {form} name="status">
				<Form.Control let:attrs>
					<Form.Label>Status</Form.Label>
					<SelectStatus {form} {attrs} />
				</Form.Control>
				<Form.Description>This is the status of the project.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="budget">
				<Form.Control let:attrs>
					<Form.Label>Budget</Form.Label>
					<NumberInput {...attrs} bind:value={$formData.budget} />
				</Form.Control>
				<Form.Description>This is the total budget for the project.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="amountpaid">
				<Form.Control let:attrs>
					<Form.Label>Amount Paid</Form.Label>
					<NumberInput {...attrs} bind:value={$formData.amountpaid} />
				</Form.Control>
				<Form.Description>This is the amount already paid for this project.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="pricehour">
				<Form.Control let:attrs>
					<Form.Label>Price/Hour</Form.Label>
					<NumberInput {...attrs} bind:value={$formData.pricehour} />
				</Form.Control>
				<Form.Description
					>This is the default price per hour for this project's sessions.</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>

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

			<Form.Button class="mt-4 w-full">{project ? 'Update' : 'Create'}</Form.Button>
		</form>
	</div>
</Panel>
