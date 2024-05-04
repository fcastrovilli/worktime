<script lang="ts">
	import NewProjectForm from './new_project_form.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	export let data;
	let form = data.form;
	$: projects = data.projects;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Projects</h1>
		<NewProjectForm data={form} clients={data.clients} />
	</div>
	<CardContainer>
		{#if projects.length > 0}
			{#each projects as project}
				<Card title={project.name}>
					<div slot="description" class="flex flex-col">
						{#if project.clients.name}
							<p class="text-sm text-muted-foreground">{project.clients.name}</p>
						{/if}
						{#if project.deadline}
							<p class="text-sm text-muted-foreground">
								Deadline: {project.deadline.toLocaleDateString()}
							</p>
						{/if}
					</div>
					<div slot="content" class="flex flex-col">
						<p>Full Budget: 10000€</p>
						<p>€/Hour: 35€</p>
					</div>
					<div slot="footer">
						<Button variant="default" class="w-full" href="/projects/{project.slug}">Show</Button>
					</div>
				</Card>
				<!-- <Card.Root class="w-full max-w-sm">
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
				</Card.Root> -->
			{/each}
		{:else}
			<p>No projects found</p>
		{/if}
	</CardContainer>
</div>
