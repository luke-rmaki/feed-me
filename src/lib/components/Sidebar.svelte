<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let {
		pending_count = 0,
		group = null,
		children
	}: {
		pending_count?: number;
		group?: { id: string; name: string } | null;
		children?: any;
	} = $props();

	let collapsed = $state(false);
	let mobile_open = $state(false);

	const is_group_route = $derived(
		$page.url.pathname.includes('/groups/') && $page.url.pathname.split('/').length > 3
	);
	const group_id = $derived($page.params.group_id);

	function toggle_collapsed() {
		collapsed = !collapsed;
	}

	function toggle_mobile() {
		mobile_open = !mobile_open;
	}

	function close_mobile() {
		mobile_open = false;
	}
</script>

<div class="sidebar" class:collapsed>
	<button class="toggle-desktop" onclick={toggle_collapsed} aria-label="Toggle sidebar">
		{collapsed ? '→' : '←'}
	</button>

	<nav class="desktop-nav">
		<a href="/groups">Groups</a>
		<a href="/invitations">
			Invitations{#if pending_count > 0}
				({pending_count}){/if}
		</a>

		{#if group}
			<hr />
			<div class="group-name">{group.name}</div>
			<a href="/groups/{group.id}">Overview</a>
			<a href="/groups/{group.id}/calendar">Calendar</a>
			<a href="/groups/{group.id}/recipes">Recipes</a>
			<a href="/groups/{group.id}/shopping">Shopping</a>
			<a href="/groups/{group.id}/settings">Settings</a>
		{/if}

		<form method="post" action="/logout?/signOut" use:enhance>
			<button type="submit" class="sign-out">Sign out</button>
		</form>
	</nav>
</div>

<button class="fab" onclick={toggle_mobile} aria-label="Open menu"> ☰ </button>

{#if mobile_open}
	<div class="mobile-overlay" onclick={close_mobile} role="presentation"></div>
	<div class="mobile-menu" class:open={mobile_open}>
		<button class="close-mobile" onclick={close_mobile} aria-label="Close menu">✕</button>
		<nav>
			<a href="/groups" onclick={close_mobile}>Groups</a>
			<a href="/invitations" onclick={close_mobile}>
				Invitations{#if pending_count > 0}
					({pending_count}){/if}
			</a>

			{#if group}
				<hr />
				<div class="group-name">{group.name}</div>
				<a href="/groups/{group.id}" onclick={close_mobile}>Overview</a>
				<a href="/groups/{group.id}/calendar" onclick={close_mobile}>Calendar</a>
				<a href="/groups/{group.id}/recipes" onclick={close_mobile}>Recipes</a>
				<a href="/groups/{group.id}/shopping" onclick={close_mobile}>Shopping</a>
				<a href="/groups/{group.id}/settings" onclick={close_mobile}>Settings</a>
			{/if}

			<hr />
			<form method="post" action="/logout?/signOut" use:enhance>
				<button type="submit" class="sign-out" onclick={close_mobile}>Sign out</button>
			</form>
		</nav>
	</div>
{/if}

<div class="main-content" class:collapsed>
	{@render children?.()}
</div>

<style>
	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		width: 200px;
		background: #f5f5f5;
		border-right: 1px solid #ddd;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		transition: width 0.2s ease;
		z-index: 100;
	}

	.sidebar.collapsed {
		width: 50px;
	}

	.sidebar.collapsed .desktop-nav a:not(.toggle-desktop),
	.sidebar.collapsed .desktop-nav hr,
	.sidebar.collapsed .desktop-nav .group-name,
	.sidebar.collapsed .desktop-nav form {
		display: none;
	}

	.toggle-desktop {
		align-self: flex-end;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		font-size: 1rem;
	}

	.sidebar.collapsed .toggle-desktop {
		align-self: center;
	}

	.desktop-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.desktop-nav a {
		padding: 0.5rem;
		text-decoration: none;
		color: #333;
		border-radius: 4px;
	}

	.desktop-nav a:hover {
		background: #e0e0e0;
	}

	.desktop-nav hr {
		margin: 0.5rem 0;
		border: none;
		border-top: 1px solid #ddd;
	}

	.group-name {
		font-weight: bold;
		padding: 0.5rem;
		color: #666;
	}

	.desktop-nav .sign-out {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		text-align: left;
		color: #333;
		border-radius: 4px;
	}

	.desktop-nav .sign-out:hover {
		background: #e0e0e0;
	}

	.fab {
		display: none;
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #333;
		color: white;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
		z-index: 200;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.mobile-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 250;
	}

	.mobile-menu {
		display: none;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 2rem;
		border-radius: 8px;
		z-index: 300;
		min-width: 200px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.mobile-menu .close-mobile {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.5rem;
	}

	.mobile-menu nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mobile-menu nav a {
		padding: 0.75rem;
		text-decoration: none;
		color: #333;
		border-radius: 4px;
	}

	.mobile-menu nav a:hover {
		background: #f0f0f0;
	}

	.mobile-menu nav hr {
		margin: 0.5rem 0;
		border: none;
		border-top: 1px solid #ddd;
	}

	.mobile-menu .sign-out {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.75rem;
		text-align: left;
		color: #333;
		border-radius: 4px;
		font-size: 1rem;
	}

	.mobile-menu .sign-out:hover {
		background: #f0f0f0;
	}

	.main-content {
		margin-left: 200px;
		padding: 1rem;
		transition: margin-left 0.2s ease;
		min-height: 100vh;
	}

	.main-content.collapsed {
		margin-left: 50px;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none;
		}

		.fab {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.mobile-overlay {
			display: block;
		}

		.mobile-menu {
			display: block;
		}

		.main-content {
			margin-left: 0;
		}

		.main-content.collapsed {
			margin-left: 0;
		}
	}
</style>
