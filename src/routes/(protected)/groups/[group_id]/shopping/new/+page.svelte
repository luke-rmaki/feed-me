<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>New Shopping List</h2>
	</div>

	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}

	<form method="post" action="?/create" use:enhance class="form-stack">
		<label>
			List name
			<input type="text" name="name" required />
		</label>
		<label>
			From date <span style="color:var(--fg-5); font-weight:400;">(optional — auto-fills from meal plan)</span>
			<input type="date" name="date_from" />
		</label>
		<label>
			To date
			<input type="date" name="date_to" />
		</label>
		<div class="form-actions">
			<button type="submit" class="primary">Create</button>
			<a href="/groups/{data.group.id}/shopping">Cancel</a>
		</div>
	</form>
</div>
