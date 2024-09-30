<script lang="ts">
	import type { ClientWithProjects } from '$lib/server/schemas';
	import { writable } from 'svelte/store';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import ClientsTableActions from './clients_table_actions.svelte';
	import DataTableCheckbox from './data_table_checkbox.svelte';
	import DataTableProjectButton from './data_table_project_button.svelte';
	import DataTableClientButton from './data_table_client_button.svelte';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let clients: ClientWithProjects[];

	const clients_table = writable(clients);
	$: $clients_table = clients;

	const table = createTable(clients_table, {
		page: addPagination({
			initialPageSize: 5,
			initialPageIndex: 0
		}),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const hidableCols = ['email', 'name', 'website', 'projects'];

	let client: ClientWithProjects | null = null;

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {}
		}),
		table.column({
			accessor: 'name',
			header: 'Name',
			plugins: {},
			cell: ({ row }) => {
				if (row.isData()) {
					client = $clients_table.find((c) => c.id === row.original.id) || null;
				}
				return createRender(DataTableClientButton, { clients: client });
			}
		}),
		table.column({
			accessor: 'email',
			header: 'Email',
			plugins: {},
			cell: ({ value }) => {
				return value ? value : 'No email provided';
			}
		}),
		table.column({
			accessor: 'website',
			header: 'Website',
			plugins: {},
			cell: ({ value }) => {
				return value ? value : 'No website provided';
			}
		}),
		table.column({
			accessor: 'projects',
			header: 'Projects',
			plugins: {},
			cell: ({ value }) => {
				return createRender(DataTableProjectButton, { projects: value });
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: () => {
				return createRender(ClientsTableActions, {
					record: client
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);
</script>

<div class="flex w-full flex-col">
	<div class="flex items-center justify-between">
		<div class="flex items-center py-4">
			<Input class="max-w-sm" placeholder="Search" type="text" bind:value={$filterValue} />
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hidableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-left [&:has([role=checkbox])]:pl-3">
										{#if cell.id === 'email' || cell.id === 'name' || cell.id === 'website' || cell.id === 'projects'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'projects'}
											<Render of={cell.render()} />
										{:else if cell.id === 'id'}
											<div class="px-1">
												<Render of={cell.render()} />
											</div>
										{:else}
											<div class="px-4 text-left">
												<Render of={cell.render()} />
											</div>
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
