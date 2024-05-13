<script lang="ts">
	import Bar from '$lib/components/crud/bar.svelte';
	import SessionRunner from '$lib/components/crud/session_runner.svelte';
</script>

<div class="container flex flex-col items-center justify-center gap-4 p-4">
	<SessionRunner />
	<Bar />
</div>
