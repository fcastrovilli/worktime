<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	import NewProjectForm from '../../projects/new_project_form.svelte';
	import type { BasicType } from '$lib/basic_utils';

	export let data;

	$: client = data.client;

	let client_clean: BasicType;

	$: client_clean = {
		id: client.id,
		name: client.name,
		slug: client.slug
	};
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if client}
		<div class="flex flex-col items-center justify-center gap-4">
			<h1 class="text-5xl font-semibold">{client.name}</h1>
			<p>{client.email ? client.email : 'No email'}</p>
			<p>{client.website ? client.website : 'No website'}</p>
			<p class="text-lg">{client.details ? client.details : 'No details'}</p>
		</div>
		<div class="flex items-center justify-center gap-4 py-5">
			<h3 class="py-5 text-2xl font-semibold">
				All Projects <small class="text-sm text-muted-foreground">({client.projects.length})</small>
			</h3>
			<NewProjectForm data={data.createProjectForm} clients={client_clean} />
		</div>
		{#if client.projects.length > 0}
			<CardContainer>
				{#each client.projects as project}
					<Card title={project.name}>
						<div slot="description" class="flex flex-col">
							<p class="text-sm text-muted-foreground">Sessions: {project.worksessions.length}</p>
						</div>
						<div slot="content" class="flex flex-col">
							<p>They owe me 1000€</p>
							{#if project.deadline}
								<p>Deadline: {project.deadline.toLocaleDateString()}</p>
							{/if}
						</div>
						<div slot="footer">
							<Button variant="default" class="w-full" href="/projects/{project.slug}">Show</Button>
						</div>
					</Card>
				{/each}
			</CardContainer>
		{/if}
	{:else}
		<p class="text-lg">Client not found</p>
	{/if}
</div>
