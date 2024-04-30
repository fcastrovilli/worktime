<script lang="ts">
	export let user;
	import Button from '../ui/button/button.svelte';
	import NavContent from './nav-content.svelte';
	import NavUser from './nav-user.svelte';
	import { Pickaxe } from 'lucide-svelte';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex h-16 items-center px-4">
		<a href="/">
			<Pickaxe size="2em" class="mx-2" />
		</a>
		{#if user}
			<NavContent class="mx-6 hidden sm:block" />
		{/if}
		<div class="ml-auto flex items-center space-x-4">
			{#if user}
				<NavUser {user} />
			{:else}
				<Button href="/signup" variant="ghost">Sign Up</Button>
			{/if}
		</div>
	</div>
</header>
