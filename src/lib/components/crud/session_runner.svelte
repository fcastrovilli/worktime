<script lang="ts">
	import CardContainer from './card_container.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from './card.svelte';
	import { Play, Pause } from 'lucide-svelte';
	import { calculateElapsedTime } from '$lib/basic_utils';
	import { Stop, Trash } from 'svelte-radix';
	let title = 'New Session';
	let running: boolean = false;
	let startTime: number | null = null;
	let stopTime: number | null = null;
	let elapsedString: string = '0s';
	let elapsedNumber: number = 0;
	let timeout: NodeJS.Timeout;
	const drift = 500;

	$: {
		if (running) {
			start();
		} else {
			stop();
		}
	}

	function start() {
		if (!startTime) {
			startTime = elapsedNumber ? Date.now() - elapsedNumber : Date.now();
			timeout = setInterval(() => {
				elapsedString = calculateElapsedTime(new Date(Number(startTime)), new Date());
			}, 1000);
		}
	}

	function stop() {
		if (startTime) {
			stopTime = Date.now();
			elapsedNumber = stopTime - startTime - drift;
			startTime = null;
			clearInterval(timeout);
		}
	}
</script>

<CardContainer>
	<Card>
		<div slot="title" class="flex items-center justify-between gap-4">
			{title}
			<Button size="icon" variant="ghost" class="rounded-full" disabled={!running}>
				<Trash size={16} />
			</Button>
		</div>
		<p slot="description">You can pause the session at any time.</p>
		<div slot="content" class="flex flex-col items-center justify-center text-center text-7xl">
			{elapsedString}
			<small class="text-xs text-muted">25€/h</small>
			<small class="text-xs text-muted-foreground">100€</small>
		</div>
		<div slot="footer" class="flex w-full items-center justify-center gap-4">
			<Button
				variant="outline"
				class="h-full rounded-full p-4"
				on:click={() => (running = !running)}
			>
				{#if running}
					<Pause size={25} />
				{:else}
					<Play size={25} />
				{/if}
			</Button>
			<Button size="icon" class="rounded-full" disabled={!running}>
				<Stop size={13} />
			</Button>
		</div>
	</Card>
</CardContainer>
