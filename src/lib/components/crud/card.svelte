<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	export let title: string;
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl font-semibold uppercase">{title}</Card.Title>
		<Card.Description>
			<slot name="description">
				<p>No description provided</p>
			</slot>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<slot name="content">
			<p>No content provided</p>
		</slot>
	</Card.Content>
	<Card.Footer>
		<slot name="footer">
			<p>No footer provided</p>
		</slot>
	</Card.Footer>
</Card.Root>
