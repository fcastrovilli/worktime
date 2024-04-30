<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';
	import '../app.pcss';
	export let data;
</script>

<Nav user={data.user} />
<slot></slot>
