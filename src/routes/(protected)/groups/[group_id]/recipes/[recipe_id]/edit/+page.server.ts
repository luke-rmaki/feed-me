import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { recipe, recipe_ingredient } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const rec = await db.query.recipe.findFirst({
		where: (t, { and, eq }) =>
			and(eq(t.id, params.recipe_id), eq(t.group_id, params.group_id)),
		with: { ingredients: { orderBy: (t, { asc }) => asc(t.sort_order) } }
	});

	if (!rec) error(404, 'Recipe not found');

	return { recipe: rec };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString() || null;
		const servings = Number(formData.get('servings')) || 4;
		const time_minutes = Number(formData.get('time_minutes')) || null;
		const instructions = formData.get('instructions')?.toString() || null;

		if (!name) return fail(400, { message: 'Recipe name is required' });

		const ingredient_names = formData.getAll('ingredient_name[]').map(String);
		const ingredient_qtys = formData.getAll('ingredient_qty[]').map(String);
		const ingredient_units = formData.getAll('ingredient_unit[]').map(String);
		const ingredient_notes_arr = formData.getAll('ingredient_notes[]').map(String);

		await db
			.update(recipe)
			.set({ name, description, servings, time_minutes, instructions })
			.where(and(eq(recipe.id, params.recipe_id), eq(recipe.group_id, params.group_id)));

		await db
			.delete(recipe_ingredient)
			.where(eq(recipe_ingredient.recipe_id, params.recipe_id));

		const ingredients = ingredient_names
			.map((ing_name, i) => ({
				name: ing_name,
				qty: ingredient_qtys[i],
				unit: ingredient_units[i],
				notes: ingredient_notes_arr[i]
			}))
			.filter((ing) => ing.name.trim());

		if (ingredients.length > 0) {
			await db.insert(recipe_ingredient).values(
				ingredients.map((ing, i) => ({
					recipe_id: params.recipe_id,
					name: ing.name.trim(),
					quantity: Number(ing.qty) || null,
					unit: ing.unit || null,
					notes: ing.notes || null,
					sort_order: i
				}))
			);
		}

		redirect(303, `/groups/${params.group_id}/recipes/${params.recipe_id}`);
	}
};
