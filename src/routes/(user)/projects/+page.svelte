<script lang="ts">
	import NewProjectForm from './new_project_form.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	export let data;
	let form = data.form;
	$: projects = data.projects;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Projects</h1>
		<NewProjectForm data={form} clients={data.clients} />
	</div>
	<div class="flex flex-wrap items-center justify-center gap-4 sm:flex-row">
		{#if projects.length > 0}
			{#each projects as project}
				<Card.Root class="w-full max-w-sm">
					<Card.Header>
						<Card.Title class="text-2xl font-semibold uppercase">{project.name}</Card.Title>
						<Card.Description>
							<p class="text-sm text-muted-foreground">{project.clients.name}</p>
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>Full Budget: 10000€</p>
						<p>€/Hour: 35€</p>
						{#if project.deadline}
							<p>Deadline: {project.deadline.toLocaleDateString()}</p>
						{/if}
					</Card.Content>
					<Card.Footer>
						<Button variant="default" class="w-full" href="/projects/{project.slug}">Show</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		{:else}
			<p>No projects found</p>
		{/if}
	</div>
</div>
