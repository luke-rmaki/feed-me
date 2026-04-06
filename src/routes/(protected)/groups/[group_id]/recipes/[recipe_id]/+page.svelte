<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page">
	<div class="page-header">
		<h2>{data.recipe.name}</h2>
		<div style="display:flex; gap:var(--vs-s); align-items:center;">
			<a href="/groups/{data.group.id}/recipes/{data.recipe.id}/edit" class="button">Edit</a>
			<form method="post" action="?/delete" use:enhance>
				<button
					type="submit"
					class="danger"
					onclick={(e) => {
						if (!confirm('Delete this recipe?')) e.preventDefault();
					}}
				>
					Delete
				</button>
			</form>
		</div>
	</div>

	{#if data.recipe.description}
		<p style="color:var(--fg-6); margin-bottom:var(--vs-m);">{data.recipe.description}</p>
	{/if}

	<div style="display:flex; gap:var(--vs-l); margin-bottom:var(--vs-l); flex-wrap:wrap;">
		<span><strong>Servings:</strong> {data.recipe.servings ?? '—'}</span>
		{#if data.recipe.time_minutes}
			<span><strong>Time:</strong> {data.recipe.time_minutes} min</span>
		{/if}
	</div>

	{#if data.recipe.ingredients.length > 0}
		<div class="section-block">
			<h3>Ingredients</h3>
			<ul style="margin:0; padding-left:var(--pad-l);">
				{#each data.recipe.ingredients as ing}
					<li style="margin-bottom:var(--vs-xs);">
						{#if ing.quantity}{ing.quantity}{/if}
						{#if ing.unit}{ing.unit}{/if}
						{ing.name}
						{#if ing.notes}<span style="color:var(--fg-5);">({ing.notes})</span>{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if data.recipe.instructions}
		<div class="section-block">
			<h3>Instructions</h3>
			<p style="margin:0; white-space:pre-wrap;">{data.recipe.instructions}</p>
		</div>
	{/if}

	<a href="/groups/{data.group.id}/recipes" style="color:var(--fg-5);">← Back to recipes</a>
</div>
