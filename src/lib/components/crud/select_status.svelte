<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import type { SuperForm } from 'sveltekit-superforms/client';
	export let form: SuperForm<any>;
	export let attrs;

	const { form: formData } = form;
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';

	let open = false;

	const status = ['inactive', 'active', 'unpaid', 'paid'];

	$: selectedValue = status.find((f) => f === $formData.status)?.toString() ?? 'Select a status';
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger
		class={cn(
			buttonVariants({ variant: 'outline' }),
			'w-full justify-between',
			!$formData.status && 'text-muted-foreground'
		)}
		role="combobox"
		{...attrs}
	>
		{selectedValue}
		<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>
	<input hidden value={$formData.status} name={attrs.name} />
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input autofocus placeholder="Search a status..." class="h-9" />
			<Command.Group>
				<Command.CommandSeparator class="my-2" />
				{#each status as state}
					<Command.Item
						value={state}
						onSelect={() => {
							$formData.status = state;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						{state}
						<Check
							class={cn('ml-auto h-4 w-4', state !== $formData.status && 'text-transparent')}
						/>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
