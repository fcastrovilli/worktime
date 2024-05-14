<script lang="ts">
	// import NewSessionForm from './new_session_form.svelte';
	import SessionsDataTable from '$lib/components/crud/tables/sessions_data_table.svelte';
	import SessionRunner from '$lib/components/crud/session_runner.svelte';
	import UpsertSessionForm from '$lib/components/crud/upsert_session_form.svelte';

	export let data;
	$: sessions = data.sessions;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Sessions</h1>
		<UpsertSessionForm data={data.upsertSessionForm} projects={data.projects} />
		<!-- <NewSessionForm data={data.createSessionForm} projects={data.projects} /> -->
	</div>
	<SessionRunner />
	<SessionsDataTable {sessions} />
</div>
