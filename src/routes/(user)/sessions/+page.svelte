<script lang="ts">
	import NewSessionForm from './new_session_form.svelte';
	import Card from '$lib/components/crud/card.svelte';
	import CardContainer from '$lib/components/crud/card_container.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	export let data;
	$: sessions = data.worksessions;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Sessions</h1>
		<NewSessionForm data={data.form} />
	</div>
	<CardContainer>
		{#if sessions.length > 0}
			{#each sessions as session, i}
				<Card title={`#${sessions.length - i}`}>
					<div slot="description" class="flex flex-col">
						<p class="text-sm text-muted-foreground">
							Total Hours: {new Date(
								new Date(session.end ?? '').getTime() - new Date(session.start).getTime()
							).getHours()}
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
		{:else}
			<p>No sessions found</p>
		{/if}
	</CardContainer>
</div>
