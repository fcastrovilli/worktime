<script lang="ts">
	import UpsertClientForm from '$lib/components/crud/upsert_client_form.svelte';
	import ClientsDataTable from '$lib/components/crud/tables/clients_data_table.svelte';
	export let data;
	$: clients = data.clients;
</script>

<div class="container flex flex-col items-center justify-center gap-4 py-5">
	<div class="flex flex-row items-center justify-center gap-4">
		<h1 class="text-4xl font-semibold">Clients</h1>
		<UpsertClientForm data={data.upsertClient} />
	</div>
	<ClientsDataTable {clients} />
</div>
