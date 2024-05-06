<script lang="ts">
	import NewProjectForm from './new_project_form.svelte';
	import ProjectsDataTable from '$lib/components/crud/tables/projects_data_table.svelte';
	export let data;
	let form = data.form;
	$: projects = data.projects;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Projects</h1>
		<NewProjectForm data={form} clients={data.clients} />
	</div>
	<ProjectsDataTable {projects} />
</div>
