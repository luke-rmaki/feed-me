<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h1>Groups</h1>
		<a href="/groups/new" class="button primary">New group</a>
	</div>

	{#if data.groups.length === 0}
		<div class="empty-state">
			<p>You're not a member of any groups yet.</p>
		</div>
	{:else}
		<ul class="item-list">
			{#each data.groups as group}
				<li><a href="/groups/{group.id}">{group.name}</a></li>
			{/each}
		</ul>
	{/if}
</div>
