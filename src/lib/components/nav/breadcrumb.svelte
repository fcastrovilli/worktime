<script lang="ts">
	import Slash from 'svelte-radix/Slash.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	import { page } from '$app/stores';
	import { Workflow } from 'lucide-svelte';

	let crumbs: Array<{ label: string; href: string }> = [];

	$: {
		// Remove zero-length tokens.
		const tokens = $page.url.pathname.split('/').filter((t) => t !== '');

		// Create { label, href } pairs for each token.
		let tokenPath = '';
		crumbs = tokens.map((t) => {
			tokenPath += '/' + t;
			t = t.charAt(0).toUpperCase() + t.slice(1);
			return {
				label: $page.data.label || t,
				href: tokenPath
			};
		});
	}
</script>

{#if crumbs.length > 0}
	<dir class="m-2 hidden items-center justify-start border-b border-border/40 px-5 pb-2 sm:flex">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Workflow />
				{#each crumbs as item, i}
					{#if crumbs.length === i + 1}
						<Breadcrumb.Item>
							<Breadcrumb.Page>{item.label}</Breadcrumb.Page>
						</Breadcrumb.Item>
					{:else}
						<Breadcrumb.Item>
							<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
						</Breadcrumb.Item>

						<Breadcrumb.Separator>
							<Slash tabindex="-1" />
						</Breadcrumb.Separator>
					{/if}
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</dir>
{/if}
