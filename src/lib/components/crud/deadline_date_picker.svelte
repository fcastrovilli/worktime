<script lang="ts">
	import { cn } from '$lib/utils.js';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
		parseDate
	} from '@internationalized/date';

	import * as Form from '$lib/components/ui/form/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	export let form;
	const { form: formData } = form;

	const df = new DateFormatter('it-IT', {
		dateStyle: 'short'
	});

	let value: DateValue | undefined;

	$: value = $formData.deadline ? parseDate($formData.deadline) : undefined;
	let placeholder: DateValue = today(getLocalTimeZone());
</script>

<Form.Field {form} name="deadline" class="flex flex-col pt-4">
	<Form.Control let:attrs>
		<Form.Label>Deadline</Form.Label>
		<Popover.Root>
			<Popover.Trigger
				{...attrs}
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'w-full justify-start pl-4 text-left font-normal',
					!value && 'text-muted-foreground'
				)}
			>
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
				<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" side="top">
				<Calendar
					{value}
					bind:placeholder
					minValue={new CalendarDate(1900, 1, 1)}
					calendarLabel="Deadline"
					initialFocus
					onValueChange={(v) => {
						if (v) {
							$formData.deadline = v.toString();
						} else {
							$formData.deadline = '';
						}
					}}
				/>
			</Popover.Content>
		</Popover.Root>
		<Form.Description>When do you think the project will be completed?</Form.Description>
		<Form.FieldErrors />
		<input hidden value={$formData.deadline} name={attrs.name} />
	</Form.Control>
</Form.Field>
