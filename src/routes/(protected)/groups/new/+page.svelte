<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h1>Create Group</h1>
	</div>

	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}

	<form method="post" action="?/create" use:enhance class="form-stack">
		<label>
			Group name
			<input type="text" name="name" required />
		</label>
		<div class="form-actions">
			<button type="submit" class="primary">Create</button>
			<a href="/groups">Cancel</a>
		</div>
	</form>
</div>
