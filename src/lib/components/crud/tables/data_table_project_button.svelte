<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type {
		Project,
		ProjectWithClients,
		ProjectWithClientsAndWorksessions
	} from '$lib/server/schemas';
	export let projects:
		| Project[]
		| Project
		| ProjectWithClients
		| ProjectWithClients[]
		| ProjectWithClientsAndWorksessions
		| ProjectWithClientsAndWorksessions[]
		| null;
	const maxDisplayedProjects = 2;
</script>

{#if projects}
	{#if Array.isArray(projects)}
		<div class="flex flex-wrap gap-2">
			{#each projects as project, i}
				{#if i < maxDisplayedProjects}
					<Button
						variant="outline"
						href={`/projects/${project.slug}`}
						class="max-w-sm overflow-clip px-2 text-xs">{project.name}</Button
					>
				{:else if i === maxDisplayedProjects}
					<Button variant="ghost" href={`/projects`} class="max-w-sm overflow-clip px-2 text-xs"
						>...more</Button
					>
				{/if}
			{/each}
		</div>
	{:else}
		<Button
			variant="outline"
			href={`/projects/${projects.slug}`}
			class="max-w-sm overflow-clip px-2 text-xs">{projects.name}</Button
		>
	{/if}
{/if}
