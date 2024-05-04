<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	import NewClientForm from './new_client_form.svelte';
	export let data;
	let form = data.form;
	$: clients = data.clients;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Clients</h1>
		<NewClientForm data={form} />
	</div>
	<CardContainer>
		{#if clients.length > 0}
			{#each clients as client}
				<Card title={client.name}>
					<div slot="description" class="flex flex-col">
						{#if client.email}
							<a href="mailto:{client.email}">{client.email}</a>
						{/if}
						{#if client.website}
							<a href={client.website} target="_blank">{client.website}</a>
						{/if}
					</div>
					<div slot="content">
						<p>Projects: {client.projects.length}</p>
					</div>
					<div slot="footer">
						<Button variant="default" class="w-full" href="/clients/{client.slug}">Show</Button>
					</div>
				</Card>
			{/each}
		{:else}
			<p>No clients found</p>
		{/if}
	</CardContainer>
</div>
