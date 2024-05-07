<script lang="ts">
	import { cn } from '$lib/utils.js';

	let className: string | undefined | null = undefined;
	export { className as class };
	import { page } from '$app/stores';

	const pages: { href: string; title: string }[] = [
		{ href: '/', title: 'Dashboard' },
		{ href: '/sessions', title: 'Sessions' },
		{ href: '/projects', title: 'Projects' },
		{ href: '/clients', title: 'Clients' }
	];

	$: currentPage = $page.url.pathname;
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
	{#each pages as page}
		<a
			href={page.href}
			class="text-sm font-medium {currentPage.includes(page.href)
				? ''
				: 'text-muted-foreground'} transition-colors hover:text-primary"
		>
			{page.title}
		</a>
	{/each}
</nav>
