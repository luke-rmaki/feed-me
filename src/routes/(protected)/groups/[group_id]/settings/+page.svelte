<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>Settings: {data.group.name}</h2>

{#if form?.success}
	<p>Saved.</p>
{/if}
{#if form?.message}
	<p>{form.message}</p>
{/if}

<h3>Rename group</h3>
<form method="post" action="?/rename" use:enhance>
	<input type="text" name="name" value={data.group.name} required />
	<button type="submit">Rename</button>
</form>

<h3>Members</h3>
<a href="/groups/{data.group.id}/settings/members">Manage members</a>

<h3>Shops</h3>
<a href="/groups/{data.group.id}/settings/shops">Manage shops</a>

<h3>Delete group</h3>
<form method="post" action="?/delete" use:enhance>
	<button
		type="submit"
		onclick={(e) => {
			if (!confirm('Delete this group? This cannot be undone.')) e.preventDefault();
		}}
	>
		Delete group
	</button>
</form>
