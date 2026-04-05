<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Groups</h1>

{#if data.groups.length === 0}
	<p>You're not a member of any groups yet.</p>
{:else}
	<ul>
		{#each data.groups as group}
			<li><a href="/groups/{group.id}">{group.name}</a></li>
		{/each}
	</ul>
{/if}

<a href="/groups/new">Create new group</a>
