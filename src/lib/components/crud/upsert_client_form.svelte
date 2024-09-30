<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { upsertClientSchema, type UpsertClient } from '$lib/zod-schemas.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import type { Client, ClientWithProjects } from '$lib/server/schemas';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<Infer<UpsertClient>>;
	export let client: Client | ClientWithProjects | undefined = undefined;
	export let open = false;

	const form = superForm(data, {
		validators: zodClient(upsertClientSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success(client ? 'Client updated successfully!' : 'Client created successfully!', {
					description: result.data?.client_name,
					position: 'bottom-right'
				});
				if (result.data?.client_slug) {
					setTimeout(() => {
						goto(`/clients/${result.data?.client_slug}`);
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

	if (client) {
		$formData = {
			id: client.id,
			name: client.name,
			email: client.email,
			website: client.website,
			details: client.details,
			currency: client.currency
		};
	} else {
		$formData.currency = 'EUR';
	}
</script>

<Panel
	bind:open
	triggerClass="h-full rounded-full p-4"
	title={client ? 'Update Client' : 'Create Client'}
	description={`Here you can ${client ? 'update' : 'create'} a client profile. Click ${client ? 'Update' : 'Creat'} when you're done.`}
>
	<slot name="trigger" slot="trigger">
		<Plus size={35} />
	</slot>
	<div slot="form">
		<form method="POST" action="/clients?/upsertClient" use:enhance>
			<input type="hidden" name="id" value={$formData.id} />
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
			<Form.Field {form} name="currency">
				<Form.Control let:attrs>
					<Form.Label>Currency</Form.Label>
					<Input {...attrs} bind:value={$formData.currency} />
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

			<Form.Button class="mt-4 w-full">{client ? 'Update' : 'Create'}</Form.Button>
		</form>
	</div>
</Panel>
