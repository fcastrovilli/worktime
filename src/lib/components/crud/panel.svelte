<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	export let open_label = 'Open';
	export let title = 'Create';
	export let description = "Make changes here. Click save when you're done.";
	export let triggerClass = '';
	export let open: boolean = false;

	import { ssp, queryParam } from 'sveltekit-search-params';
	import { onMount } from 'svelte';

	const edit = queryParam('edit', ssp.boolean(), { showDefaults: false });
	onMount(() => {
		if ($edit) $edit = null;
	});
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class={triggerClass}>
			<slot name="trigger">{open_label}</slot>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="no-scrollbar overflow-y-auto">
		<Sheet.Header>
			<Sheet.Title>{title}</Sheet.Title>
			<Sheet.Description>
				{description}
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
			<slot name="form" />
		</div>
	</Sheet.Content>
</Sheet.Root>
