<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let ingredients: { name: string; qty: string; unit: string; notes: string }[] = $state([
		{ name: '', qty: '', unit: '', notes: '' }
	]);

	function add_ingredient() {
		ingredients = [...ingredients, { name: '', qty: '', unit: '', notes: '' }];
	}

	function remove_ingredient(i: number) {
		ingredients = ingredients.filter((_, idx) => idx !== i);
	}
</script>

<h2>New Recipe</h2>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/create" use:enhance>
	<label>
		Name
		<input type="text" name="name" required />
	</label>
	<label>
		Description
		<textarea name="description"></textarea>
	</label>
	<label>
		Servings
		<input type="number" name="servings" value="4" min="1" />
	</label>
	<label>
		Time (minutes)
		<input type="number" name="time_minutes" min="1" />
	</label>
	<label>
		Instructions
		<textarea name="instructions"></textarea>
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

	<button type="submit">Create recipe</button>
</form>

<a href="/groups/{data.group.id}/recipes">Cancel</a>
