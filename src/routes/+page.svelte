<script lang="ts">
	import Bar from '$lib/components/crud/bar.svelte';
	import SessionRunner from '$lib/components/crud/session_runner.svelte';
	export let data;
</script>

<div class="container flex flex-col items-center justify-center gap-4 p-4">
	<h1 class="hidden text-center text-4xl sm:block">
		Welcome, <span class="font-bold">{data.user?.username}</span>!
	</h1>
	<div class="flex w-full flex-col-reverse items-center justify-center gap-2 sm:flex-row">
		<Bar />
		<SessionRunner />
	</div>
</div>
