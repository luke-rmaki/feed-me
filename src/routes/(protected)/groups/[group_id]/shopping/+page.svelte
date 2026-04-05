<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h2>Shopping Lists</h2>

{#if data.lists.length === 0}
	<p>No shopping lists yet.</p>
{:else}
	<ul>
		{#each data.lists as list}
			<li>
				<a href="/groups/{data.group.id}/shopping/{list.id}">{list.name}</a>
				{#if list.date_from && list.date_to}
					<small>({list.date_from} – {list.date_to})</small>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<a href="/groups/{data.group.id}/shopping/new">New shopping list</a>
