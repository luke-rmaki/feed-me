<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let ingredients = $state(
		untrack(() => data.recipe.ingredients).map((ing) => ({
			name: ing.name,
			qty: ing.quantity?.toString() ?? '',
			unit: ing.unit ?? '',
			notes: ing.notes ?? ''
		}))
	);

	function add_ingredient() {
		ingredients = [...ingredients, { name: '', qty: '', unit: '', notes: '' }];
	}

	function remove_ingredient(i: number) {
		ingredients = ingredients.filter((_, idx) => idx !== i);
	}
</script>

<h2>Edit: {data.recipe.name}</h2>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/update" use:enhance>
	<label>
		Name
		<input type="text" name="name" value={data.recipe.name} required />
	</label>
	<label>
		Description
		<textarea name="description">{data.recipe.description ?? ''}</textarea>
	</label>
	<label>
		Servings
		<input type="number" name="servings" value={data.recipe.servings ?? 4} min="1" />
	</label>
	<label>
		Time (minutes)
		<input type="number" name="time_minutes" value={data.recipe.time_minutes ?? ''} min="1" />
	</label>
	<label>
		Instructions
		<textarea name="instructions">{data.recipe.instructions ?? ''}</textarea>
	</label>

	<fieldset>
		<legend>Ingredients</legend>
		{#each ingredients as ing, i}
			<div>
				<input type="text" name="ingredient_name[]" placeholder="Name" bind:value={ing.name} />
				<input
					type="number"
					name="ingredient_qty[]"
					placeholder="Qty"
					bind:value={ing.qty}
					step="any"
				/>
				<input type="text" name="ingredient_unit[]" placeholder="Unit" bind:value={ing.unit} />
				<input type="text" name="ingredient_notes[]" placeholder="Notes" bind:value={ing.notes} />
				<button type="button" onclick={() => remove_ingredient(i)}>Remove</button>
			</div>
		{/each}
		<button type="button" onclick={add_ingredient}>Add ingredient</button>
	</fieldset>

	<button type="submit">Save changes</button>
</form>

<a href="/groups/{data.group.id}/recipes/{data.recipe.id}">Cancel</a>
