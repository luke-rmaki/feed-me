<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h1>Invitations</h1>
		<a href="/groups">Back to groups</a>
	</div>

	{#if data.invitations.length === 0}
		<div class="empty-state">
			<p>No pending invitations.</p>
		</div>
	{:else}
		<ul class="item-list">
			{#each data.invitations as invitation}
				<li>
					<span style="flex:1; padding: var(--pad-m) var(--pad-l);">
						<strong>{invitation.group.name}</strong>
						<span style="color:var(--fg-5); font-size:0.9rem;">
							— invited by {invitation.invited_by.name}
						</span>
					</span>
					<form method="post" action="?/accept" use:enhance>
						<input type="hidden" name="invitation_id" value={invitation.id} />
						<button type="submit" class="primary">Accept</button>
					</form>
					<form method="post" action="?/decline" use:enhance style="padding-right: var(--pad-m)">
						<input type="hidden" name="invitation_id" value={invitation.id} />
						<button type="submit">Decline</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</div>
