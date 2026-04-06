<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>Shops</h2>
		<a href="/groups/{data.group.id}/settings">← Back to settings</a>
	</div>

	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}

	<div class="section-block">
		{#if data.shops.length === 0}
			<p style="color:var(--fg-5); margin:0;">No shops yet.</p>
		{:else}
			<ul class="item-list" style="margin-bottom:0;">
				{#each data.shops as s}
					<li style="flex-wrap:wrap; gap:var(--vs-s); padding: var(--pad-s) var(--pad-m);">
						<span style="font-weight:500; flex:1; min-width:100px; padding:var(--pad-s) 0;"
							>{s.name}</span
						>
						<form method="post" action="?/rename" use:enhance style="display:flex; gap:var(--vs-s);">
							<input type="hidden" name="id" value={s.id} />
							<input type="text" name="name" value={s.name} required style="width:auto;" />
							<button type="submit">Rename</button>
						</form>
						<form method="post" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={s.id} />
							<button type="submit" class="danger">Delete</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="section-block">
		<h3>Add shop</h3>
		<form method="post" action="?/add" use:enhance class="form-stack">
			<label>
				Shop name
				<input type="text" name="name" placeholder="e.g. Supermarket" required />
			</label>
			<div class="form-actions">
				<button type="submit" class="primary">Add shop</button>
			</div>
		</form>
	</div>
</div>
