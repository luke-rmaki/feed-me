<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>New Shopping List</h2>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/create" use:enhance>
	<label>
		List name
		<input type="text" name="name" required />
	</label>
	<label>
		From date (optional — auto-fills from meal plan)
		<input type="date" name="date_from" />
	</label>
	<label>
		To date
		<input type="date" name="date_to" />
	</label>
	<button type="submit">Create</button>
</form>

<a href="/groups/{data.group.id}/shopping">Cancel</a>
