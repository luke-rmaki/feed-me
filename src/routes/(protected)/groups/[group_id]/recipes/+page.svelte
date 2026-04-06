<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>Recipes</h2>
		<a href="/groups/{data.group.id}/recipes/new" class="button primary">Add recipe</a>
	</div>

	{#if data.recipes.length === 0}
		<div class="empty-state">
			<p>No recipes yet.</p>
		</div>
	{:else}
		<ul class="item-list">
			{#each data.recipes as recipe}
				<li>
					<a href="/groups/{data.group.id}/recipes/{recipe.id}">{recipe.name}</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
