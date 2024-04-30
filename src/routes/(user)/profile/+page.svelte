<script lang="ts">
	import DeleteAccount from './delete_account.svelte';
	export let data;
	const user = data.user;
</script>

<div class="container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
	<div class="flex flex-col items-center justify-start space-y-2 p-4 pt-10">
		<img src={user?.avatar} alt={user?.username} class="h-20 w-20 rounded-full object-cover" />
		<p class="pb-2 text-lg font-medium leading-none">{user?.fullname}</p>
		<p class="text-sm leading-none text-muted-foreground">{user?.username}</p>
		<p class="text-xs leading-none text-muted-foreground">{user?.github_id}</p>
	</div>

	<hr class="my-4 w-full max-w-sm" />
	<div class="flex flex-col items-center justify-center space-y-10 p-4">
		<h3 class="text-lg text-red-500">Warning Zone</h3>

		<DeleteAccount />
	</div>
</div>
