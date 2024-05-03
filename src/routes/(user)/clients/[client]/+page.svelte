<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	export let data;

	$: client = data.client;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if client}
		<h1 class="text-4xl font-semibold">{client.name}</h1>
		<p>{client.email ? client.email : 'No email'}</p>
		<p>{client.website ? client.website : 'No website'}</p>

		<p class="text-lg">{client.details ? client.details : 'No details'}</p>

		<h3 class="py-5 text-2xl font-semibold">
			Projects <small class="text-sm text-muted-foreground">({client.projects.length})</small>
		</h3>
		{#if client.projects.length > 0}
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				{#each client.projects as project}
					<Card.Root class="w-full max-w-sm">
						<Card.Header>
							<Card.Title class="text-2xl font-semibold uppercase">{project.name}</Card.Title>
							<Card.Description>
								<p class="text-sm text-muted-foreground">Sessions: {project.worksessions.length}</p>
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>They owe me 1000€</p>
							{#if project.deadline}
								<p>Deadline: {project.deadline.toLocaleDateString()}</p>
							{/if}
						</Card.Content>
						<Card.Footer>
							<Button variant="default" class="w-full" href="/projects/{project.slug}">Show</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		{/if}
	{:else}
		<p class="text-lg">Client not found</p>
	{/if}
</div>
