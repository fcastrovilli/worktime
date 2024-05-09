<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { enhance } from '$app/forms';

	export let open: boolean = false;
	export let formAction: string;
	export let item: string;
	export let id: string;
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this {item} and remove it's data from
				our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="post" use:enhance>
				<AlertDialog.Action type="submit" formaction={formAction}>Continue</AlertDialog.Action>
				<input type="hidden" name="id" value={id} />
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
