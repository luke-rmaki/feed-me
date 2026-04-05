<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>Members</h2>

{#if form?.message}
	<p>{form.message}</p>
{/if}
{#if form?.success}
	<p>Done.</p>
{/if}

<h3>Current members</h3>
<ul>
	{#each data.members as member}
		<li>
			{member.user.name} ({member.user.email})
			<form method="post" action="?/remove_member" use:enhance style="display:inline">
				<input type="hidden" name="user_id" value={member.user_id} />
				<button type="submit">Remove</button>
			</form>
		</li>
	{/each}
</ul>

<h3>Pending invitations</h3>
{#if data.invitations.length === 0}
	<p>None.</p>
{:else}
	<ul>
		{#each data.invitations as invitation}
			<li>
				{invitation.invitee.name} ({invitation.invitee.email})
				<form method="post" action="?/cancel_invitation" use:enhance style="display:inline">
					<input type="hidden" name="invitation_id" value={invitation.id} />
					<button type="submit">Cancel</button>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<h3>Invite user</h3>
<form method="post" action="?/invite" use:enhance>
	<input type="email" name="email" placeholder="Email address" required />
	<button type="submit">Invite</button>
</form>

<a href="/groups/{data.group.id}/settings">Back to settings</a>
