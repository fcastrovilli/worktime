<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container flex flex-col items-center justify-center py-10">
	<h1 class="text-4xl font-semibold">Ooops :(</h1>
	<h2 class="text-xl">{$page.error?.message}</h2>
</div>
