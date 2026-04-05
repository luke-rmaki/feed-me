<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Invitations</h1>

{#if data.invitations.length === 0}
	<p>No pending invitations.</p>
{:else}
	<ul>
		{#each data.invitations as invitation}
			<li>
				<strong>{invitation.group.name}</strong>
				— invited by {invitation.invited_by.name}
				<form method="post" action="?/accept" use:enhance style="display:inline">
					<input type="hidden" name="invitation_id" value={invitation.id} />
					<button type="submit">Accept</button>
				</form>
				<form method="post" action="?/decline" use:enhance style="display:inline">
					<input type="hidden" name="invitation_id" value={invitation.id} />
					<button type="submit">Decline</button>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<a href="/groups">Back to groups</a>
