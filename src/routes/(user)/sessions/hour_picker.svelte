<script lang="ts">
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
		CalendarDateTime,
		parseDateTime,
		toTime
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';

	export let form;
	const { form: formData } = form;

	let start_date: DateValue | undefined;
	$: start_date = $formData.start ? parseDateTime($formData.start) : undefined;
	let start_datetime: CalendarDateTime | undefined;
	$: start_datetime = start_date ? start_date : undefined;

	let end_date: DateValue | undefined;
	$: end_date = $formData.end ? parseDateTime($formData.end) : undefined;
	let end_datetime: CalendarDateTime | undefined;
	$: end_datetime = end_date ? end_date : undefined;

	const df = new DateFormatter('it-IT', {
		dateStyle: 'short',
		timeStyle: 'short'
	});
	const today_date = today(getLocalTimeZone());
	let placeholder: DateValue = new CalendarDateTime(
		today_date.year,
		today_date.month,
		today_date.day
	);
</script>

<!-- START DATE -->
<Form.Field {form} name="start">
	<Form.Control>
		<div class="flex flex-col gap-2">
			<Form.Label>Start</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-full justify-start pl-4 text-left font-normal',
						!start_date && 'text-muted-foreground'
					)}
				>
					{start_date ? df.format(start_date.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						value={start_date}
						bind:placeholder
						minValue={new CalendarDateTime(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Start"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								if (start_datetime) {
									const new_start_datetime = start_datetime.set({
										hour: start_datetime.hour,
										minute: start_datetime.minute,
										day: v.day,
										month: v.month,
										year: v.year,
										era: v.era
									});
									$formData.start = new_start_datetime.toString();
									if (end_datetime) {
										$formData.end = new_start_datetime.toString();
									}
								} else {
									$formData.start = v.toString();
									if (end_datetime) {
										$formData.end = v.toString();
									}
								}
							} else {
								$formData.start = '';
								$formData.end = '';
							}
						}}
					>
						<div slot="time" class="gap-2 border-b border-t py-2">
							{#if start_datetime && start_date}
								<Input
									type="time"
									name="time-start"
									value={toTime(start_datetime)}
									on:change={(e) => {
										if (e.currentTarget.valueAsDate) {
											const raw_time = e.currentTarget.valueAsDate;
											const hour = raw_time?.getHours() ?? 0;
											const minute = raw_time?.getMinutes() ?? 0;
											start_datetime = start_date.set({
												hour: hour - 1,
												minute,
												day: start_date.day,
												month: start_date.month,
												year: start_date.year,
												era: start_date.era
											});
											$formData.end = start_datetime.toString();
											$formData.start = start_datetime.toString();
										} else {
											$formData.start = '';
											$formData.end = '';
										}
									}}
								/>
							{/if}
						</div>
					</Calendar>
				</Popover.Content>
			</Popover.Root>
		</div>
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

<!-- END DATE -->

<Form.Field {form} name="end">
	<Form.Control>
		<div class="flex flex-col gap-2">
			<Form.Label>End</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-full justify-start pl-4 text-left font-normal',
						!end_date && 'text-muted-foreground'
					)}
					disabled={!start_datetime}
				>
					{end_date ? df.format(end_date.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						value={end_date}
						bind:placeholder
						minValue={start_datetime}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="End"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								if (end_datetime) {
									const new_end_datetime = end_datetime.set({
										hour: end_datetime.hour,
										minute: end_datetime.minute,
										day: v.day,
										month: v.month,
										year: v.year,
										era: v.era
									});
									$formData.end = new_end_datetime.toString();
								} else {
									$formData.end = v.toString();
								}
							} else {
								$formData.end = '';
							}
						}}
					>
						<div slot="time" class="gap-2 border-b border-t py-2">
							{#if end_datetime && end_date}
								<Input
									type="time"
									name="time-end"
									value={toTime(end_datetime)}
									on:change={(e) => {
										if (e.currentTarget.valueAsDate) {
											const raw_time = e.currentTarget.valueAsDate;
											const hour = raw_time?.getHours() ?? 0;
											const minute = raw_time?.getMinutes() ?? 0;
											end_datetime = end_date.set({
												hour: hour - 1,
												minute,
												day: end_date.day,
												month: end_date.month,
												year: end_date.year,
												era: end_date.era
											});
											$formData.end = end_datetime.toString();
										} else {
											$formData.end = '';
										}
									}}
								/>
							{/if}
						</div>
					</Calendar>
				</Popover.Content>
			</Popover.Root>
		</div>
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
