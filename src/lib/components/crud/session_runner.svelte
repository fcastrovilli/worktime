<script lang="ts">
	import CardContainer from './card_container.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Card from './card.svelte';
	import { Play, Pause } from 'lucide-svelte';
	import { calculateElapsedTime } from '$lib/basic_utils';
	let title = 'Start Session';
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
	<Card {title}>
		<p slot="description">You can pause the session at any time.</p>
		<div slot="content" class="flex flex-col items-center justify-center gap-4">
			<Button
				variant="outline"
				class="h-full rounded-full p-4"
				on:click={() => (running = !running)}
			>
				{#if running}
					<Pause size={35} />
				{:else}
					<Play size={35} />
				{/if}
			</Button>
		</div>
		<div slot="footer" class="flex items-center justify-center">Duration: {elapsedString}</div>
	</Card>
</CardContainer>
