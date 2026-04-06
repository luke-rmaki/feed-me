<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>Shopping Lists</h2>
		<a href="/groups/{data.group.id}/shopping/new" class="button primary">New list</a>
	</div>

	{#if data.lists.length === 0}
		<div class="empty-state">
			<p>No shopping lists yet.</p>
		</div>
	{:else}
		<ul class="item-list">
			{#each data.lists as list}
				<li>
					<a href="/groups/{data.group.id}/shopping/{list.id}">{list.name}</a>
					{#if list.date_from && list.date_to}
						<span class="item-meta">{list.date_from} – {list.date_to}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
