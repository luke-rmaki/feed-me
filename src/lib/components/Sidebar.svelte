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
		background: var(--fg-05);
		border-right: var(--border-1);
		padding: var(--pad-l);
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
		padding: var(--pad-s);
		font-size: 1rem;
		color: var(--fg-5);
		border-radius: var(--br-s);
		transition: color 0.15s;
	}

	.toggle-desktop:hover {
		color: var(--fg);
		background: var(--fg-1);
	}

	.sidebar.collapsed .toggle-desktop {
		align-self: center;
	}

	.desktop-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.desktop-nav a {
		padding: var(--pad-s) var(--pad-m);
		text-decoration: none;
		color: var(--fg-7);
		border-radius: var(--br-m);
		font-size: 0.9rem;
		font-weight: 500;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.desktop-nav a:hover {
		background: var(--fg-1);
		color: var(--fg);
	}

	:global(.desktop-nav a[aria-current='page']) {
		background: var(--primary-1);
		color: var(--primary);
	}

	.desktop-nav hr {
		margin: var(--vs-s) 0;
		border: none;
		border-top: var(--border-1);
	}

	.group-name {
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: var(--pad-s) var(--pad-m);
		color: var(--fg-4);
	}

	.desktop-nav .sign-out {
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--pad-s) var(--pad-m);
		text-align: left;
		color: var(--fg-7);
		border-radius: var(--br-m);
		font-size: 0.9rem;
		font-weight: 500;
		width: 100%;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.desktop-nav .sign-out:hover {
		background: var(--fg-1);
		color: var(--fg);
	}

	.fab {
		display: none;
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--fg-9);
		color: var(--bg);
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
		z-index: 200;
		box-shadow: var(--shadow-4);
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
		background: var(--bg);
		padding: var(--pad-xxl);
		border-radius: var(--br-l);
		z-index: 300;
		min-width: 220px;
		box-shadow: var(--shadow-6);
		border: var(--border-1);
	}

	.mobile-menu .close-mobile {
		position: absolute;
		top: var(--pad-s);
		right: var(--pad-s);
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: var(--pad-s);
		color: var(--fg-5);
		border-radius: var(--br-s);
	}

	.mobile-menu .close-mobile:hover {
		background: var(--fg-1);
		color: var(--fg);
	}

	.mobile-menu nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.mobile-menu nav a {
		display: block;
		padding: var(--pad-m);
		text-decoration: none;
		color: var(--fg-7);
		border-radius: var(--br-m);
		font-weight: 500;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.mobile-menu nav a:hover {
		background: var(--fg-05);
		color: var(--fg);
	}

	:global(.mobile-menu nav a[aria-current='page']) {
		background: var(--primary-1);
		color: var(--primary);
	}

	.mobile-menu nav hr {
		margin: var(--vs-s) 0;
		border: none;
		border-top: var(--border-1);
	}

	.mobile-menu .sign-out {
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--pad-m);
		text-align: left;
		color: var(--fg-7);
		border-radius: var(--br-m);
		font-size: 1rem;
		font-weight: 500;
		width: 100%;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.mobile-menu .sign-out:hover {
		background: var(--fg-05);
		color: var(--fg);
	}

	.main-content {
		margin-left: 200px;
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
