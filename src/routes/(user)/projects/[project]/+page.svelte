<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	import type { PageData } from './$types';
	import { calculateElapsedTime } from '$lib/basic_utils';
	import SessionRunner from '$lib/components/crud/session_runner.svelte';
	import NewSessionForm from '../../sessions/new_session_form.svelte';

	export let data: PageData;

	$: project = data.project;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if project}
		<div class="flex flex-col items-center justify-center gap-4">
			<h1 class="text-5xl font-semibold">{project.name}</h1>
			<h3><a href="/clients/{project.clients.slug}">{project.clients.name}</a></h3>
			<p>
				{project.deadline ? 'Deadline: ' + project.deadline.toLocaleDateString() : 'No deadline'}
			</p>
			<p class="text-lg">{project.description ? project.description : 'No description'}</p>
		</div>
		<SessionRunner />

		<div class="flex items-center justify-center gap-4 py-5">
			<h3 class="text-2xl font-semibold">
				All Sessions <small class="text-sm text-muted-foreground"
					>({project.worksessions.length})</small
				>
			</h3>
			<NewSessionForm data={data.createWorksessionForm} projects={project} />
		</div>
		{#if project.worksessions.length > 0}
			<CardContainer>
				{#each project.worksessions as session, i}
					<Card>
						<div slot="title" class="flex flex-row items-baseline gap-2">
							<Label class="text-2xl font-semibold uppercase"
								>#{project.worksessions.length - i}</Label
							>
							<p class="text-sm lowercase text-muted-foreground">
								{session.end ? calculateElapsedTime(session.start, session.end) : 'Still ongoing'}
							</p>
						</div>
						<div slot="content" class="flex flex-col">
							<p>
								Start: {session.start.toLocaleDateString()}
								{session.start.toLocaleTimeString()}
							</p>

							{#if session.end}
								<p>End: {session.end.toLocaleDateString()} {session.end.toLocaleTimeString()}</p>
							{/if}
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
