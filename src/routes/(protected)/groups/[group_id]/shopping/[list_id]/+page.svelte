<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<div>
			<h2 style="margin:0 0 var(--vs-xs) 0;">{data.list.name}</h2>
			{#if data.list.date_from && data.list.date_to}
				<p style="margin:0; color:var(--fg-5); font-size:0.9rem;">
					{data.list.date_from} – {data.list.date_to}
				</p>
			{/if}
		</div>
		<a href="/groups/{data.group.id}/shopping" style="color:var(--fg-5);">← Back to lists</a>
	</div>

	{#if data.list.items.length === 0}
		<div class="empty-state">
			<p>No items yet.</p>
		</div>
	{:else}
		{#each data.shops as shop}
			{@const shop_items = data.list.items.filter((i) => i.shop_id === shop.id)}
			{#if shop_items.length > 0}
				<h3 style="margin-bottom:var(--vs-s); color:var(--fg-6); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">{shop.name}</h3>
				<ul class="item-list" style="margin-bottom:var(--vs-m);">
					{#each shop_items as item}
						<li style={item.checked ? 'opacity:0.5;' : ''}>
							<form method="post" action="?/toggle_item" use:enhance style="padding-left:var(--pad-m);">
								<input type="hidden" name="id" value={item.id} />
								<input type="hidden" name="checked" value={item.checked} />
								<button type="submit" style="font-size:1.1rem; --button-color:var(--primary);">
									{item.checked ? '✓' : '○'}
								</button>
							</form>
							<span
								style="flex:1; padding:var(--pad-m) 0; {item.checked
									? 'text-decoration:line-through;'
									: ''}"
							>
								{#if item.quantity}{item.quantity}{/if}
								{#if item.unit}{item.unit} {/if}
								{item.name}
								{#if item.recipe}
									<small style="color:var(--fg-4);">({item.recipe.name})</small>
								{/if}
							</span>
							<form
								method="post"
								action="?/delete_item"
								use:enhance
								style="padding-right:var(--pad-m);"
							>
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="danger">×</button>
							</form>
						</li>
					{/each}
				</ul>
			{/if}
		{/each}

		{@const unassigned = data.list.items.filter((i) => !i.shop_id)}
		{#if unassigned.length > 0}
			<h3 style="margin-bottom:var(--vs-s); color:var(--fg-6); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">Unassigned</h3>
			<ul class="item-list" style="margin-bottom:var(--vs-m);">
				{#each unassigned as item}
					<li style={item.checked ? 'opacity:0.5;' : ''}>
						<form method="post" action="?/toggle_item" use:enhance style="padding-left:var(--pad-m);">
							<input type="hidden" name="id" value={item.id} />
							<input type="hidden" name="checked" value={item.checked} />
							<button type="submit" style="font-size:1.1rem;">
								{item.checked ? '✓' : '○'}
							</button>
						</form>
						<span
							style="flex:1; padding:var(--pad-m) 0; {item.checked
								? 'text-decoration:line-through;'
								: ''}"
						>
							{#if item.quantity}{item.quantity}{/if}
							{#if item.unit}{item.unit} {/if}
							{item.name}
							{#if item.recipe}
								<small style="color:var(--fg-4);">({item.recipe.name})</small>
							{/if}
						</span>
						<form
							method="post"
							action="?/delete_item"
							use:enhance
							style="padding-right:var(--pad-m);"
						>
							<input type="hidden" name="id" value={item.id} />
							<button type="submit" class="danger">×</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}

	<div class="section-block">
		<h3>Add item</h3>
		<form method="post" action="?/add_item" use:enhance>
			<div style="display:flex; gap:var(--vs-s); flex-wrap:wrap; align-items:flex-end;">
				<label style="flex:2; min-width:140px; display:flex; flex-direction:column; gap:var(--vs-xs); font-weight:500; font-size:0.9rem;">
					Item name
					<input type="text" name="name" placeholder="e.g. Milk" required />
				</label>
				<label style="flex:1; min-width:80px; display:flex; flex-direction:column; gap:var(--vs-xs); font-weight:500; font-size:0.9rem;">
					Qty
					<input type="number" name="quantity" placeholder="0" step="any" />
				</label>
				<label style="flex:1; min-width:80px; display:flex; flex-direction:column; gap:var(--vs-xs); font-weight:500; font-size:0.9rem;">
					Unit
					<input type="text" name="unit" placeholder="L, g…" />
				</label>
				<label style="flex:1; min-width:120px; display:flex; flex-direction:column; gap:var(--vs-xs); font-weight:500; font-size:0.9rem;">
					Shop
					<select name="shop_id">
						<option value="">— any —</option>
						{#each data.shops as shop}
							<option value={shop.id}>{shop.name}</option>
						{/each}
					</select>
				</label>
				<button type="submit" class="primary" style="margin-bottom:0;">Add item</button>
			</div>
		</form>

		{#if form?.message}
			<p class="message error" style="margin-top:var(--vs-s);">{form.message}</p>
		{/if}
	</div>
</div>
