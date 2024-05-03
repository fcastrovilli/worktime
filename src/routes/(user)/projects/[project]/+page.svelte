<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
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
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				{#each project.worksessions as session, i}
					<Card.Root class="w-full max-w-sm">
						<Card.Header>
							<Card.Title class="text-2xl font-semibold uppercase"
								>{project.worksessions.length - i}</Card.Title
							>
							<Card.Description>
								<p class="text-sm">
									Total Hours: {new Date(session.end).getTime() - new Date(session.start).getTime()}
								</p>
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>Start: {session.start.toLocaleDateString()}</p>
							<p>End: {session.end.toLocaleDateString()}</p>
						</Card.Content>
						<Card.Footer>
							<Button variant="default" class="w-full" href="/sessions/{session.id}">Show</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		{/if}
	{:else}
		<p class="text-lg">Project not found</p>
	{/if}
</div>
