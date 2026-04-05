<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h2>Recipes</h2>

{#if data.recipes.length === 0}
	<p>No recipes yet.</p>
{:else}
	<ul>
		{#each data.recipes as recipe}
			<li>
				<a href="/groups/{data.group.id}/recipes/{recipe.id}">{recipe.name}</a>
			</li>
		{/each}
	</ul>
{/if}

<a href="/groups/{data.group.id}/recipes/new">Add recipe</a>
