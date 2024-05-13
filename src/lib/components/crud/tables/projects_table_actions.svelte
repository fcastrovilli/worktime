<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import DeleteItem from '../delete_item.svelte';
	import type { ProjectWithClientsAndWorksessions } from '$lib/server/schemas';
	import UpsertProjectForm from '../upsert_project_form.svelte';
	export let record: ProjectWithClientsAndWorksessions | null = null;

	let openDelete = false;
	let openEdit = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item href={`/projects/${record?.slug ?? ''}`}>View</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => (openEdit = true)}>Edit</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openDelete = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

{#if record}
	<DeleteItem
		id={record.id}
		formAction="/projects?/deleteProject"
		item="project"
		bind:open={openDelete}
	/>
{/if}
<!-- 
{#if record}
<UpsertProjectForm data={form} project={record} bind:open={openEdit} />
{/if} -->
