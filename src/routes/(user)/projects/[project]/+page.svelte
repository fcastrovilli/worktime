<script lang="ts">
	import type { PageData } from './$types';
	import SessionRunner from '$lib/components/crud/session_runner.svelte';
	import UpsertSessionForm from '$lib/components/crud/upsert_session_form.svelte';
	import UpsertProjectForm from '$lib/components/crud/upsert_project_form.svelte';
	import { Settings } from 'lucide-svelte';

	export let data: PageData;

	import { ssp, queryParam } from 'sveltekit-search-params';
	import SessionSmallDataTable from '$lib/components/crud/tables/sessions_small_data_table.svelte';

	const edit = queryParam('edit', ssp.boolean(), { showDefaults: false });

	$: project = data.project;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-10">
	{#if project}
		<div class="flex flex-col items-center justify-center gap-4">
			<div class="flex flex-row items-center justify-center gap-4">
				<h1 class="text-5xl font-semibold">{project.name}</h1>
				<UpsertProjectForm
					data={data.upsertProject}
					{project}
					clients={data.clients}
					open={$edit ?? undefined}
				>
					<Settings size={35} slot="trigger" />
				</UpsertProjectForm>
			</div>
			<h3><a href="/clients/{project.clients.slug}">{project.clients.name}</a></h3>
			<p>
				{project.deadline ? 'Deadline: ' + project.deadline.toLocaleDateString() : 'No deadline'}
			</p>
			<p class="text-lg">{project.description ? project.description : 'No description'}</p>
		</div>
		<SessionRunner />

		<div class="flex items-center justify-center gap-4 py-5">
			<h3 class="text-2xl font-semibold">
				All Sessions <small class="text-sm text-muted-foreground">({project.sessions.length})</small
				>
			</h3>
			<UpsertSessionForm data={data.upsertSessionForm} projects={project} />
		</div>
		{#if project.sessions.length > 0}
			<SessionSmallDataTable sessions={project.sessions} />
		{/if}
	{:else}
		<p class="text-lg">Project not found</p>
	{/if}
</div>
