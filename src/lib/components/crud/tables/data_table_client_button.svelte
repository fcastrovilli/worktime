<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Client, ClientWithProjects } from '$lib/server/schemas';
	export let clients: Client[] | Client | ClientWithProjects | ClientWithProjects[] | null;
	const maxDisplayedClients = 2;
</script>

{#if clients}
	{#if Array.isArray(clients)}
		<div class="flex flex-wrap gap-2">
			{#each clients as client, i}
				{#if i < maxDisplayedClients}
					<Button
						variant="outline"
						href={`/clients/${client.slug}`}
						class="max-w-sm overflow-clip px-2 text-xs">{client.name}</Button
					>
				{:else if i === maxDisplayedClients}
					<Button variant="ghost" href={`/clients`} class="max-w-sm overflow-clip px-2 text-xs"
						>...more</Button
					>
				{/if}
			{/each}
		</div>
	{:else}
		<Button
			variant="outline"
			href={`/clients/${clients.slug}`}
			class="max-w-sm overflow-clip px-2 text-xs">{clients.name}</Button
		>
	{/if}
{/if}
