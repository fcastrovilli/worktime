<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from 'lucide-svelte';
	import Panel from '$lib/components/crud/panel.svelte';
	import ClientForm from './client_form.svelte';
	export let data;
	// let clients = data.clients;
	let form = data.form;
	$: clients = data.clients;
	let open = false;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	<h1 class="text-4xl font-semibold">Clients</h1>
	<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
		<Panel
			bind:open
			triggerClass="h-full rounded-full p-4"
			title="New Client"
			description="Here you can create a new client profile. Click 'Create' when you're done."
		>
			<Plus slot="trigger" size={50} />
			<div slot="form">
				<ClientForm data={form} bind:open />
			</div>
		</Panel>
		{#if clients.length > 0}
			{#each clients as client}
				<Card.Root class="w-full max-w-sm">
					<Card.Header>
						<Card.Title class="text-2xl font-semibold uppercase">{client.name}</Card.Title>
						<Card.Description>{client.email}</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>Projects: 120</p>
					</Card.Content>
					<Card.Footer>
						<Button variant="default" class="w-full">Show</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		{:else}
			<p>No clients found</p>
		{/if}
	</div>
</div>
