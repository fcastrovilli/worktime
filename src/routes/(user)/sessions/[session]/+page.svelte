<script lang="ts">
	import { calculateElapsedTime } from '$lib/basic_utils.js';
	import Time from 'svelte-time';
	export let data;
	$: session = data.session;
	import UpsertSessionForm from '$lib/components/crud/upsert_session_form.svelte';

	import { Settings } from 'lucide-svelte';

	import { ssp, queryParam } from 'sveltekit-search-params';

	const edit = queryParam('edit', ssp.boolean(), { showDefaults: false });
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if session}
		<div class="flex flex-col items-center justify-center gap-4">
			<div class="flex flex-row items-center justify-center gap-4">
				<h1 class="text-5xl font-semibold">{calculateElapsedTime(session.duration)}</h1>
				<UpsertSessionForm
					open={$edit ?? undefined}
					data={data.upsertSessionForm}
					{session}
					projects={data.projects}
				>
					<Settings size={35} slot="trigger" />
				</UpsertSessionForm>
			</div>
			<h3><a href="/projects/{session.projects.slug}">{session.projects.name}</a></h3>
			<p class="text-lg">
				<Time timestamp={session.start} format="DD/MM/YYYY HH:mm" />
			</p>
			{#if session.end}
				<p class="text-lg">
					<Time timestamp={session.end} format="DD/MM/YYYY HH:mm" />
				</p>
			{/if}
			<p class="text-lg">{session.details ? session.details : 'No details'}</p>
		</div>
	{:else}
		<p class="text-lg">Project not found</p>
	{/if}
</div>
