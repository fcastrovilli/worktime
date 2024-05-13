<script lang="ts">
	export let data;
</script>

<div class="container flex flex-col items-center justify-center gap-4 p-4">
	<h1 class="hidden text-center text-4xl sm:block">
		Welcome, <span class="font-bold">{data.user?.username}</span>!
	</h1>
</div>
