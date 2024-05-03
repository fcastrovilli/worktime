<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import NewClientForm from './new_client_form.svelte';
	export let data;
	let form = data.form;
	$: clients = data.clients;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	<h1 class="text-4xl font-semibold">Clients</h1>
	<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
		<NewClientForm data={form} />
		{#if clients.length > 0}
			{#each clients as client}
				<Card.Root class="w-full max-w-sm">
					<Card.Header>
						<Card.Title class="text-2xl font-semibold uppercase">{client.name}</Card.Title>
						<Card.Description>
							{#if client.email}
								<a href="mailto:{client.email}">{client.email}</a>
							{/if}
							{#if client.website}
								<a href={client.website} target="_blank">{client.website}</a>
							{/if}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>Projects: {client.projects.length}</p>
					</Card.Content>
					<Card.Footer>
						<Button variant="default" class="w-full" href="/clients/{client.slug}">Show</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		{:else}
			<p>No clients found</p>
		{/if}
	</div>
</div>
