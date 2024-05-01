<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	export let data;
</script>

<Nav user={data.user} />
<Toaster />
<slot></slot>
