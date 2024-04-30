<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { GithubLogo } from 'svelte-radix';

	let isLoading = false;
</script>

<div class="container">
	<div class="m-auto flex w-full max-w-lg flex-col justify-center space-y-6 p-10">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">Sign Up</h1>
			<p class="text-sm text-muted-foreground">Use your GitHub account to signup</p>
		</div>

		<Button
			on:click={() => {
				isLoading = true;
			}}
			href="/signup/github"
			variant="outline"
			class="w-full"
		>
			{#if isLoading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<GithubLogo class="mr-2 h-4 w-4" />
			{/if}
			GitHub
		</Button>
	</div>
</div>
