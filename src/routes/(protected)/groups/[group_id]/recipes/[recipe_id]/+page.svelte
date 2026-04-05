<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h2>{data.recipe.name}</h2>

{#if data.recipe.description}
	<p>{data.recipe.description}</p>
{/if}

<p>Servings: {data.recipe.servings ?? '—'}</p>

{#if data.recipe.time_minutes}
	<p>Time: {data.recipe.time_minutes} min</p>
{/if}

{#if data.recipe.ingredients.length > 0}
	<h3>Ingredients</h3>
	<ul>
		{#each data.recipe.ingredients as ing}
			<li>
				{#if ing.quantity}{ing.quantity}{/if}
				{#if ing.unit}{ing.unit}{/if}
				{ing.name}
				{#if ing.notes}({ing.notes}){/if}
			</li>
		{/each}
	</ul>
{/if}

{#if data.recipe.instructions}
	<h3>Instructions</h3>
	<p>{data.recipe.instructions}</p>
{/if}

<a href="/groups/{data.group.id}/recipes/{data.recipe.id}/edit">Edit</a>

<form method="post" action="?/delete" use:enhance>
	<button
		type="submit"
		onclick={(e) => {
			if (!confirm('Delete this recipe?')) e.preventDefault();
		}}
	>
		Delete
	</button>
</form>

<a href="/groups/{data.group.id}/recipes">Back to recipes</a>
