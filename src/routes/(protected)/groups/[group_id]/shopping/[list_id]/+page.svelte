<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>{data.list.name}</h2>

{#if data.list.date_from && data.list.date_to}
	<p>{data.list.date_from} – {data.list.date_to}</p>
{/if}

{#if data.list.items.length === 0}
	<p>No items yet.</p>
{:else}
	{#each data.shops as shop}
		{@const shop_items = data.list.items.filter((i) => i.shop_id === shop.id)}
		{#if shop_items.length > 0}
			<h3>{shop.name}</h3>
			<ul>
				{#each shop_items as item}
					<li style={item.checked ? 'opacity:0.5; text-decoration:line-through' : ''}>
						<form method="post" action="?/toggle_item" use:enhance style="display:inline">
							<input type="hidden" name="id" value={item.id} />
							<input type="hidden" name="checked" value={item.checked} />
							<button type="submit">{item.checked ? '✓' : '○'}</button>
						</form>
						{#if item.quantity}{item.quantity}{/if}
						{#if item.unit}{item.unit}{/if}
						{item.name}
						{#if item.recipe}<small>({item.recipe.name})</small>{/if}
						<form method="post" action="?/delete_item" use:enhance style="display:inline">
							<input type="hidden" name="id" value={item.id} />
							<button type="submit">×</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	{/each}

	{@const unassigned = data.list.items.filter((i) => !i.shop_id)}
	{#if unassigned.length > 0}
		<h3>Unassigned</h3>
		<ul>
			{#each unassigned as item}
				<li style={item.checked ? 'opacity:0.5; text-decoration:line-through' : ''}>
					<form method="post" action="?/toggle_item" use:enhance style="display:inline">
						<input type="hidden" name="id" value={item.id} />
						<input type="hidden" name="checked" value={item.checked} />
						<button type="submit">{item.checked ? '✓' : '○'}</button>
					</form>
					{#if item.quantity}{item.quantity}{/if}
					{#if item.unit}{item.unit}{/if}
					{item.name}
					{#if item.recipe}<small>({item.recipe.name})</small>{/if}
					<form method="post" action="?/delete_item" use:enhance style="display:inline">
						<input type="hidden" name="id" value={item.id} />
						<button type="submit">×</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<form method="post" action="?/add_item" use:enhance>
	<input type="text" name="name" placeholder="Item name" required />
	<input type="number" name="quantity" placeholder="Qty" step="any" />
	<input type="text" name="unit" placeholder="Unit" />
	<select name="shop_id">
		<option value="">— shop —</option>
		{#each data.shops as shop}
			<option value={shop.id}>{shop.name}</option>
		{/each}
	</select>
	<button type="submit">Add item</button>
</form>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<a href="/groups/{data.group.id}/shopping">Back to lists</a>
