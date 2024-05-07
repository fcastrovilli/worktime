<script lang="ts">
	import NewSessionForm from './new_session_form.svelte';
	// import Card from '$lib/components/crud/card.svelte';
	// import CardContainer from '$lib/components/crud/card_container.svelte';
	// import { Button } from '$lib/components/ui/button/index.js';
	// import { Label } from '$lib/components/ui/label';
	// import { calculateElapsedTime } from '$lib/basic_utils';
	import SessionsDataTable from '$lib/components/crud/tables/sessions_data_table.svelte';

	export let data;
	$: worksessions = data.worksessions;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Sessions</h1>
		<NewSessionForm data={data.form} projects={data.projects} />
	</div>
	<SessionsDataTable {worksessions} />
	<!-- <CardContainer>
		{#if sessions.length > 0}
			{#each sessions as session, i}
				<Card>
					<div slot="title" class="flex flex-row items-baseline gap-2">
						<Label class="text-2xl font-semibold uppercase">#{sessions.length - i}</Label>
						<p class="text-sm lowercase text-muted-foreground">
							{session.end ? calculateElapsedTime(session.start, session.end) : 'Still ongoing'}
						</p>
					</div>
					<div slot="description" class="flex flex-col">
						<span class="text-xl text-foreground">{session.projects.name}</span>
						<span class="text-xs text-muted-foreground">{session.clients.name}</span>
					</div>
					<div slot="content" class="flex flex-col">
						<p>{session.details}</p>
					</div>
					<div slot="footer">
						<Button variant="default" class="w-full" href="/sessions/{session.id}">Show</Button>
					</div>
				</Card>
			{/each}
		{:else}
			<p>No sessions found</p>
		{/if}
	</CardContainer> -->
</div>
