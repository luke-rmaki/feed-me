<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>Create Group</h1>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/create" use:enhance>
	<label>
		Group name
		<input type="text" name="name" required />
	</label>
	<button type="submit">Create</button>
</form>

<a href="/groups">Cancel</a>
