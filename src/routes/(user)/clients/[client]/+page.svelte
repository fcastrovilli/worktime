<script lang="ts">
	import UpsertProjectForm from '$lib/components/crud/upsert_project_form.svelte';
	import UpsertClientForm from '$lib/components/crud/upsert_client_form.svelte';
	import type { BasicType } from '$lib/basic_utils';
	import { Settings } from 'lucide-svelte';
	import { ssp, queryParam } from 'sveltekit-search-params';
	import ProjectsDataTable from '$lib/components/crud/tables/projects_data_table.svelte';

	const edit = queryParam('edit', ssp.boolean(), { showDefaults: false });

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
			<div class="flex h-full flex-row items-center justify-center gap-4">
				<h1 class="text-5xl font-semibold">{client.name}</h1>
				<UpsertClientForm data={data.upsertClient} {client} open={$edit ?? undefined}>
					<Settings size={35} slot="trigger" />
				</UpsertClientForm>
			</div>
			<p>{client.email ? client.email : 'No email'}</p>
			<p>{client.website ? client.website : 'No website'}</p>
			<p class="text-lg">{client.details ? client.details : 'No details'}</p>
		</div>

		<div class="flex items-center justify-center gap-4 py-5">
			<h3 class="py-5 text-2xl font-semibold">
				All Projects <small class="text-sm text-muted-foreground">({client.projects.length})</small>
			</h3>
			<UpsertProjectForm data={data.upsertProject} clients={client_clean} />
		</div>
		{#if client.projects.length > 0}
			<ProjectsDataTable projects={client.projects} />
		{/if}
	{:else}
		<p class="text-lg">Client not found</p>
	{/if}
</div>
