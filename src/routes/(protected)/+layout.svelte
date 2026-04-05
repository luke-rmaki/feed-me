<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const group = $derived((data as any).group);
</script>

<Sidebar pending_count={data.pending_count} {group}>
	{@render children()}
</Sidebar>
