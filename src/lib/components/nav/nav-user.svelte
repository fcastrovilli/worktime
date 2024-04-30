<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';

	let logout_form: HTMLFormElement;
	export let user;
	const abbreviateName = (name: string) => {
		return name.substring(0, 2).toUpperCase();
	};
</script>

<form method="post" action="/logout" use:enhance bind:this={logout_form} />
<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={user?.avatar} alt={user?.username} />
				<Avatar.Fallback>{abbreviateName(user?.username || 'Worktime')}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="p-0 font-normal">
			<DropdownMenu.Item href="/profile">
				<div class="flex flex-col space-y-1">
					<p class="text-md font-medium leading-none">
						{user?.username}
					</p>
					<p class="text-xs leading-none text-muted-foreground">{user?.fullname}</p>
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<div class="block sm:hidden">
			<DropdownMenu.Group>
				<DropdownMenu.Item href="/">
					Dashboard
					<DropdownMenu.Shortcut class="hidden sm:block">⇧⌘P</DropdownMenu.Shortcut>
				</DropdownMenu.Item>

				<DropdownMenu.Item href="/sessions">
					Sessions
					<DropdownMenu.Shortcut class="hidden sm:block">⇧⌘P</DropdownMenu.Shortcut>
				</DropdownMenu.Item>

				<DropdownMenu.Item href="/projects">
					Projects
					<DropdownMenu.Shortcut class="hidden sm:block">⇧⌘P</DropdownMenu.Shortcut>
				</DropdownMenu.Item>

				<DropdownMenu.Item href="/clients">
					Clients
					<DropdownMenu.Shortcut class="hidden sm:block">⇧⌘P</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
		</div>
		<DropdownMenu.Item
			on:click={() => {
				logout_form.submit();
			}}
		>
			Logout
			<DropdownMenu.Shortcut class="hidden sm:block">⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
