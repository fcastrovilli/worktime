<script lang="ts">
	import ProjectsDataTable from '$lib/components/crud/tables/projects_data_table.svelte';
	import UpsertProjectForm from '$lib/components/crud/upsert_project_form.svelte';
	export let data;
	$: projects = data.projects;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Projects</h1>
		<UpsertProjectForm data={data.upsertProject} clients={data.clients} />
	</div>
	<ProjectsDataTable {projects} />
</div>
