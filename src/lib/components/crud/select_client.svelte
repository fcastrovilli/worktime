<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import type { BasicType } from '$lib/basic_utils';
	import type { SuperForm } from 'sveltekit-superforms/client';
	export let form: SuperForm<any>;
	export let clients: BasicType[] | BasicType;
	export let attrs;

	const { form: formData } = form;
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';

	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	$: selectedValue = Array.isArray(clients)
		? clients.find((f) => f.id === $formData.client)?.name ?? 'Select a client'
		: clients.name;
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger
		disabled={!Array.isArray(clients)}
		class={cn(
			buttonVariants({ variant: 'outline' }),
			'w-full justify-between',
			!$formData.client && 'text-muted-foreground'
		)}
		role="combobox"
		{...attrs}
	>
		{selectedValue}
		<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>
	<input hidden value={$formData.client} name={attrs.name} />
	{#if Array.isArray(clients)}
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input autofocus placeholder="Search client..." class="h-9" />
				<Command.Empty>No client found.</Command.Empty>
				<Command.Group>
					<Command.Item value="new">
						<a href="/clients" class="h-full w-full text-sm text-muted-foreground"
							>Create a new client</a
						>
					</Command.Item>
					<Command.CommandSeparator class="my-2" />
					{#each clients as client}
						<Command.Item
							value={client.name}
							onSelect={() => {
								$formData.client = client.id;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							{client.name}
							<Check
								class={cn('ml-auto h-4 w-4', client.id !== $formData.client && 'text-transparent')}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	{/if}
</Popover.Root>
