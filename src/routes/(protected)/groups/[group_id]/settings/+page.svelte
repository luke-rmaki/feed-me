<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>Settings</h2>
	</div>

	{#if form?.success}
		<p class="message success">Saved.</p>
	{/if}
	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}

	<div class="section-block">
		<h3>Rename group</h3>
		<form method="post" action="?/rename" use:enhance class="form-stack">
			<label>
				Group name
				<input type="text" name="name" value={data.group.name} required />
			</label>
			<div class="form-actions">
				<button type="submit" class="primary">Rename</button>
			</div>
		</form>
	</div>

	<div class="section-block">
		<h3>Members</h3>
		<a href="/groups/{data.group.id}/settings/members">Manage members →</a>
	</div>

	<div class="section-block">
		<h3>Shops</h3>
		<a href="/groups/{data.group.id}/settings/shops">Manage shops →</a>
	</div>

	<div class="section-block" style="border-color:var(--red-3);">
		<h3 style="color:var(--red);">Danger zone</h3>
		<form method="post" action="?/delete" use:enhance>
			<button
				type="submit"
				class="danger"
				onclick={(e) => {
					if (!confirm('Delete this group? This cannot be undone.')) e.preventDefault();
				}}
			>
				Delete group
			</button>
		</form>
	</div>
</div>
