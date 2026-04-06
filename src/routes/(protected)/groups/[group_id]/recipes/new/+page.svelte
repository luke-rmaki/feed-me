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

<div class="page">
	<div class="page-header">
		<h2>New Recipe</h2>
	</div>

	{#if form?.message}
		<p class="message error">{form.message}</p>
	{/if}

	<form method="post" action="?/create" use:enhance class="form-stack" style="max-width:600px;">
		<label>
			Name
			<input type="text" name="name" required />
		</label>
		<label>
			Description
			<textarea name="description" rows="2"></textarea>
		</label>
		<div style="display:flex; gap:var(--vs-m);">
			<label style="flex:1;">
				Servings
				<input type="number" name="servings" value="4" min="1" />
			</label>
			<label style="flex:1;">
				Time (minutes)
				<input type="number" name="time_minutes" min="1" />
			</label>
		</div>
		<label>
			Instructions
			<textarea name="instructions" rows="4"></textarea>
		</label>

		<fieldset style="border:var(--border-1); border-radius:var(--br-m); padding:var(--pad-l);">
			<legend style="font-weight:600; padding:0 var(--pad-s);">Ingredients</legend>
			<div style="display:flex; flex-direction:column; gap:var(--vs-s);">
				{#each ingredients as ing, i}
					<div style="display:flex; gap:var(--vs-s); align-items:flex-end; flex-wrap:wrap;">
						<label style="flex:2; min-width:120px;">
							Name
							<input
								type="text"
								name="ingredient_name[]"
								placeholder="Ingredient"
								bind:value={ing.name}
							/>
						</label>
						<label style="flex:1; min-width:70px;">
							Qty
							<input
								type="number"
								name="ingredient_qty[]"
								placeholder="0"
								bind:value={ing.qty}
								step="any"
							/>
						</label>
						<label style="flex:1; min-width:70px;">
							Unit
							<input type="text" name="ingredient_unit[]" placeholder="g, ml…" bind:value={ing.unit} />
						</label>
						<label style="flex:2; min-width:100px;">
							Notes
							<input type="text" name="ingredient_notes[]" placeholder="optional" bind:value={ing.notes} />
						</label>
						<button type="button" onclick={() => remove_ingredient(i)} style="margin-bottom:0;">
							Remove
						</button>
					</div>
				{/each}
			</div>
			<button
				type="button"
				onclick={add_ingredient}
				style="margin-top:var(--vs-s); --button-color: var(--fg-3);"
			>
				+ Add ingredient
			</button>
		</fieldset>

		<div class="form-actions">
			<button type="submit" class="primary">Create recipe</button>
			<a href="/groups/{data.group.id}/recipes">Cancel</a>
		</div>
	</form>
</div>
