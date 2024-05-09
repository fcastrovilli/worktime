<script lang="ts">
	import { GithubLogo } from 'svelte-radix';
	export let user;
	import Button from '../ui/button/button.svelte';
	import Breadcrumb from './breadcrumb.svelte';
	import NavContent from './nav-content.svelte';
	import NavUser from './nav-user.svelte';
	import { Pickaxe } from 'lucide-svelte';
</script>

<header
	class="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex h-16 items-center border-b border-border/40 px-4">
		<a href="/">
			<Pickaxe size="2em" class="mx-2" />
		</a>
		{#if user}
			<NavContent class="mx-6 hidden sm:block" />
		{/if}
		<div class="ml-auto flex items-center space-x-2">
			<Button
				href="https://github.com/fcastrovilli/worktime"
				target="_blank"
				class="rounded-full p-2"
				variant="ghost"><GithubLogo class="h-4 w-4" /></Button
			>
			{#if user}
				<NavUser {user} />
			{:else}
				<Button href="/signup" variant="ghost">Sign Up</Button>
			{/if}
		</div>
	</div>
	<Breadcrumb />
</header>
