<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import DeleteItem from '../delete_item.svelte';

	export let id: string;
	export let item: string;
	export let formAction: string;
	let open = false;
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
			<DropdownMenu.Item>View</DropdownMenu.Item>
			<DropdownMenu.Item>Edit</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (open = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<DeleteItem {id} {formAction} {item} bind:open />
