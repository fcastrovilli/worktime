<script lang="ts">
	import * as Tooltip from '../ui/tooltip';
	import Home from 'lucide-svelte/icons/home';
	import Pickaxe from 'lucide-svelte/icons/pickaxe';
	import Settings from 'lucide-svelte/icons/settings';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import UserRound from 'lucide-svelte/icons/user-round';
	import Clock from 'lucide-svelte/icons/clock';
	import Book from 'lucide-svelte/icons/book';
	import * as Sheet from '../ui/sheet';
	import { Button } from '../ui/button';
	import Breadcrumb from './breadcrumb.svelte';
	import NavUser from './nav-user.svelte';
	import { GithubLogo } from 'svelte-radix';
	import { type ComponentType } from 'svelte';
	import { page } from '$app/stores';

	export let user;

	type pagesList = {
		href: string;
		title: string;
		icon: ComponentType<Home | Pickaxe | Settings | PanelLeft | Clock | UserRound | Book>;
	};

	const menuItems: pagesList[] = [
		{ href: '/dashboard', title: 'Dashboard', icon: Home },
		{ href: '/sessions', title: 'Sessions', icon: Clock },
		{ href: '/projects', title: 'Projects', icon: Book },
		{ href: '/clients', title: 'Clients', icon: UserRound }
	];
	$: currentPage = $page.url.pathname;
</script>

<div class="flex flex-col sm:gap-4 sm:pl-14">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 py-4">
			<a
				href="/"
				class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
			>
				<Pickaxe class="h-4 w-4 transition-all group-hover:scale-110" />
				<span class="sr-only">WORKTIME</span>
			</a>
			{#if user}
				{#each menuItems as item}
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<a
								href={item.href}
								class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 {currentPage.startsWith(
									item.href
								)
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground'}"
								use:builder.action
								{...builder}
							>
								<svelte:component this={item.icon} class="h-5 w-5" />
								<span class="sr-only">{item.title}</span>
							</a>
						</Tooltip.Trigger>
						<Tooltip.Content side="right">{item.title}</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			{/if}
		</nav>
		<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
			{#if user}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<a
							href="/profile"
							class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 {currentPage.startsWith(
								'/profile'
							)
								? 'bg-accent text-accent-foreground'
								: 'text-muted-foreground'}"
							use:builder.action
							{...builder}
						>
							<Settings class="h-5 w-5" />
							<span class="sr-only">Settings</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Settings</Tooltip.Content>
				</Tooltip.Root>
			{/if}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="https://github.com/fcastrovilli/worktime"
						target="_blank"
						class="rounded-full p-2"
						use:builder.action
						{...builder}
					>
						<GithubLogo class="h-5 w-5" />
						<span class="sr-only">GitHub</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">GitHub</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<header
		class="fixed top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:pr-20"
	>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
					<PanelLeft class="h-5 w-5" />
					<span class="sr-only">Toggle Menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left" class="sm:max-w-xs">
				<nav class="grid gap-6 text-lg font-medium">
					<a
						href="/"
						class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
					>
						<Pickaxe class="h-5 w-5 transition-all group-hover:scale-110" />
						<span class="sr-only">WORKTIME</span>
					</a>
					{#if user}
						{#each menuItems as item}
							<a
								href={item.href}
								class="flex items-center gap-4 px-2.5 hover:text-foreground {currentPage.startsWith(
									item.href
								)
									? ''
									: 'text-muted-foreground'}"
							>
								<svelte:component this={item.icon} class="h-5 w-5" />
								{item.title}
							</a>
						{/each}
					{/if}

					{#if user}
						<a
							href="/profile"
							class="flex items-center gap-4 px-2.5 hover:text-foreground {currentPage.startsWith(
								'/profile'
							)
								? ''
								: 'text-muted-foreground'}"
						>
							<Settings class="h-5 w-5" />
							Settings
						</a>
					{:else}
						<a href="/signup" class="flex items-center gap-4 px-2.5 hover:text-foreground">
							Sign Up
						</a>
					{/if}
					<a
						href="https://github.com/fcastrovilli/worktime"
						target="_blank"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<GithubLogo class="h-5 w-5" />
						GitHub
					</a>
				</nav>
			</Sheet.Content>
		</Sheet.Root>

		<Breadcrumb />
		<div class="ml-auto flex items-center space-x-2">
			{#if user}
				<NavUser {user} />
			{:else}
				<Button href="/signup" variant="ghost">Sign Up</Button>
			{/if}
		</div>
	</header>
</div>
