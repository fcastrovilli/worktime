<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: project = data.project;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if project}
		<h1 class="text-4xl font-semibold">{project.name}</h1>
		<h3><a href="/clients/{project.clients.slug}">{project.clients.name}</a></h3>
		<p>{project.deadline ? 'Deadline: ' + project.deadline.toLocaleDateString() : 'No deadline'}</p>
		<p class="text-lg">{project.description ? project.description : 'No description'}</p>

		<h3 class="py-5 text-2xl font-semibold">
			Sessions <small class="text-sm text-muted-foreground">({project.worksessions.length})</small>
		</h3>
		{#if project.worksessions.length > 0}
			<CardContainer>
				{#each project.worksessions as session, i}
					<Card title={`#${project.worksessions.length - i}`}>
						<div slot="description" class="flex flex-col">
							<p class="text-sm text-muted-foreground">
								Total Hours: {new Date(
									new Date(session.end).getTime() - new Date(session.start).getTime()
								).getHours()}
							</p>
						</div>
						<div slot="content" class="flex flex-col">
							<p>
								Start: {session.start.toLocaleDateString()}
								{session.start.toLocaleTimeString()}
							</p>
							<p>End: {session.end.toLocaleDateString()} {session.end.toLocaleTimeString()}</p>
						</div>
						<div slot="footer">
							<Button variant="default" class="w-full" href="/sessions/{session.id}">Show</Button>
						</div>
					</Card>
				{/each}
			</CardContainer>
		{/if}
	{:else}
		<p class="text-lg">Project not found</p>
	{/if}
</div>
