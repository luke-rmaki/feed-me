import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { recipe, recipe_ingredient } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	create: async ({ request, params, locals }) => {
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

		const recipe_id = crypto.randomUUID();

		await db.insert(recipe).values({
			id: recipe_id,
			group_id: params.group_id,
			name,
			description,
			servings,
			time_minutes,
			instructions,
			created_by: locals.user!.id
		});

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
					recipe_id,
					name: ing.name.trim(),
					quantity: Number(ing.qty) || null,
					unit: ing.unit || null,
					notes: ing.notes || null,
					sort_order: i
				}))
			);
		}

		redirect(303, `/groups/${params.group_id}/recipes/${recipe_id}`);
	}
};
