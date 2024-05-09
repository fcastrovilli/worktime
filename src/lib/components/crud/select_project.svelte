<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import type { BasicType } from '$lib/basic_utils';
	import type { SuperForm } from 'sveltekit-superforms/client';
	export let form: SuperForm<any>;
	export let projects: BasicType[] | BasicType;
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

	let selectedValue = '';

	if (!Array.isArray(projects)) {
		selectedValue = projects.name;
		$formData.project = projects.id;
	}

	$: selectedValue = Array.isArray(projects)
		? projects.find((f) => f.id === $formData.project)?.name ?? 'Select a project'
		: projects.name;
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger
		disabled={!Array.isArray(projects)}
		class={cn(
			buttonVariants({ variant: 'outline' }),
			'w-full justify-between',
			!$formData.project && 'text-muted-foreground'
		)}
		role="combobox"
		{...attrs}
	>
		{selectedValue}
		<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>
	<input hidden value={$formData.project} name={attrs.name} />
	{#if Array.isArray(projects)}
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input autofocus placeholder="Search project..." class="h-9" />
				<Command.Empty>No project found.</Command.Empty>
				<Command.Group class="max-h-[300px] overflow-y-auto">
					<Command.Item value="new">
						<a href="/projects" class="h-full w-full text-sm text-muted-foreground"
							>Create a new project</a
						>
					</Command.Item>
					<Command.CommandSeparator class="my-2" />
					{#each projects as project}
						<Command.Item
							value={project.name}
							onSelect={() => {
								$formData.project = project.id;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							{project.name}
							<Check
								class={cn(
									'ml-auto h-4 w-4',
									project.id !== $formData.project && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	{/if}
</Popover.Root>
