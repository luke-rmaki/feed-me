<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>Members</h2>
		<a href="/groups/{data.group.id}/settings">← Back to settings</a>
	</div>

	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}
	{#if form?.success}
		<p class="message success">Done.</p>
	{/if}

	<div class="section-block">
		<h3>Current members</h3>
		<ul class="item-list" style="margin-bottom:0;">
			{#each data.members as member}
				<li>
					<span style="flex:1; padding: var(--pad-m) var(--pad-l);">
						<span style="font-weight:500;">{member.user.name}</span>
						<span style="color:var(--fg-5); font-size:0.9rem;"> ({member.user.email})</span>
					</span>
					<form
						method="post"
						action="?/remove_member"
						use:enhance
						style="padding-right:var(--pad-m);"
					>
						<input type="hidden" name="user_id" value={member.user_id} />
						<button type="submit" class="danger">Remove</button>
					</form>
				</li>
			{/each}
		</ul>
	</div>

	<div class="section-block">
		<h3>Pending invitations</h3>
		{#if data.invitations.length === 0}
			<p style="color:var(--fg-5); margin:0;">None.</p>
		{:else}
			<ul class="item-list" style="margin-bottom:0;">
				{#each data.invitations as invitation}
					<li>
						<span style="flex:1; padding: var(--pad-m) var(--pad-l);">
							<span style="font-weight:500;">{invitation.invitee.name}</span>
							<span style="color:var(--fg-5); font-size:0.9rem;"> ({invitation.invitee.email})</span>
						</span>
						<form
							method="post"
							action="?/cancel_invitation"
							use:enhance
							style="padding-right:var(--pad-m);"
						>
							<input type="hidden" name="invitation_id" value={invitation.id} />
							<button type="submit">Cancel</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="section-block">
		<h3>Invite user</h3>
		<form method="post" action="?/invite" use:enhance class="form-stack">
			<label>
				Email address
				<input type="email" name="email" placeholder="name@example.com" required />
			</label>
			<div class="form-actions">
				<button type="submit" class="primary">Send invite</button>
			</div>
		</form>
	</div>
</div>
