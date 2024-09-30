<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import HourPicker from './hour_picker.svelte';
	import type {
		BasicProjectWithClients,
		BasicProjectWithClientsAndSessions
	} from '$lib/basic_utils';
	import SelectProject from '$lib/components/crud/select_project.svelte';
	import type {
		Session,
		SessionWithClients,
		SessionWithProjects,
		SessionWithProjectsAndClients
	} from '$lib/server/schemas';
	import { upsertSessionSchema, type UpsertSession } from '$lib/zod-schemas';
	import { onMount } from 'svelte';
	import { CalendarDateTime, type DateValue } from '@internationalized/date';
	import { NumberInput } from '../ui/numberinput';

	export let data: SuperValidated<Infer<UpsertSession>>;
	export let projects:
		| BasicProjectWithClients
		| BasicProjectWithClientsAndSessions
		| BasicProjectWithClients[]
		| BasicProjectWithClientsAndSessions[];

	export let session:
		| Session
		| SessionWithClients
		| SessionWithProjects
		| SessionWithProjectsAndClients
		| undefined = undefined;

	export let open = false;

	const form = superForm(data, {
		validators: zodClient(upsertSessionSchema),
		taintedMessage: null,
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Session created successfully!', {
					description: result.data?.session_name,
					position: 'bottom-right'
				});
			} else {
				console.log(result);
				toast.error('Please fix the errors in the form.', {
					position: 'bottom-right'
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	$: {
		if ($formData.project) {
			if (Array.isArray(projects)) {
				const selected_project = projects.find((p) => p.id === $formData.project);
				$formData.project = selected_project?.id ?? '';
				$formData.pricehour = selected_project?.pricehour ?? 0;
				$formData.client = selected_project?.clients.id ?? '';
			} else {
				$formData.client = projects.clients.id; // projects.find((p) => p.id === $formData.project)?.clients.id ?? '';
				$formData.pricehour = projects.pricehour;
			}
		}
	}
	onMount(() => {
		if (session) {
			const start: DateValue = new CalendarDateTime(
				session.start.getFullYear(),
				session.start.getMonth(),
				session.start.getDate(),
				session.start.getHours(),
				session.start.getMinutes()
			);
			const end: DateValue | undefined = session.end
				? new CalendarDateTime(
						session.end.getFullYear(),
						session.end.getMonth(),
						session.end.getDate(),
						session.end.getHours(),
						session.end.getMinutes()
					)
				: undefined;
			$formData = {
				id: session.id,
				duration: session.duration,
				start: start.toString(),
				end: end?.toString() ?? null,
				details: session.details,
				client: session.client_id,
				project: session.project_id,
				pricehour: session.pricehour
			};
		}
	});
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title={session ? 'Update Session' : 'New Session'}
	description={session
		? "Here you can update a session. Click 'Update' when you're done."
		: "Here you can create a new session. Click 'Create' when you're done."}
>
	<slot name="trigger" slot="trigger">
		<Plus size={35} />
	</slot>
	<div slot="form">
		<form method="POST" action="/sessions?/upsertSession" use:enhance>
			<input type="hidden" name="client" value={$formData.client} />
			<Form.Field {form} name="project">
				<Form.Control let:attrs>
					<Form.Label>Project</Form.Label>
					<SelectProject {form} {projects} {attrs} />
				</Form.Control>
				<Form.Description>
					You can manage projects in your <a href="/projects">projects page</a>.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<HourPicker {form} />
			<Form.Field {form} name="pricehour">
				<Form.Control let:attrs>
					<Form.Label>Price/Hour</Form.Label>
					<NumberInput {...attrs} bind:value={$formData.pricehour} />
				</Form.Control>
				<Form.Description>This is the price per hour for this session.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="details">
				<Form.Control let:attrs>
					<Form.Label>Details</Form.Label>
					<Textarea
						{...attrs}
						placeholder="Add any additional detail about the session."
						bind:value={$formData.details}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="mt-4 w-full">{session ? 'Update' : 'Create'}</Form.Button>
		</form>
	</div>
</Panel>
