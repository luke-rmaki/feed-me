<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>Shops</h2>

{#if form?.message}
	<p>{form.message}</p>
{/if}

{#if data.shops.length === 0}
	<p>No shops yet.</p>
{:else}
	<ul>
		{#each data.shops as s}
			<li>
				{s.name}
				<form method="post" action="?/rename" use:enhance style="display:inline">
					<input type="hidden" name="id" value={s.id} />
					<input type="text" name="name" value={s.name} required />
					<button type="submit">Rename</button>
				</form>
				<form method="post" action="?/delete" use:enhance style="display:inline">
					<input type="hidden" name="id" value={s.id} />
					<button type="submit">Delete</button>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<form method="post" action="?/add" use:enhance>
	<input type="text" name="name" placeholder="Shop name" required />
	<button type="submit">Add shop</button>
</form>

<a href="/groups/{data.group.id}/settings">Back to settings</a>
