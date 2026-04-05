import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { shopping_list, shopping_list_item } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const shops = await db.query.shop.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { asc }) => asc(t.name)
	});

	return { shops };
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const date_from = formData.get('date_from')?.toString() || null;
		const date_to = formData.get('date_to')?.toString() || null;

		if (!name) return fail(400, { message: 'List name is required' });

		const list_id = crypto.randomUUID();

		await db.insert(shopping_list).values({
			id: list_id,
			group_id: params.group_id,
			name,
			date_from,
			date_to
		});

		// Auto-populate items from meal plan if date range given
		if (date_from && date_to) {
			const entries = await db.query.meal_plan_entry.findMany({
				where: (t, { and, eq, gte, lte }) =>
					and(eq(t.group_id, params.group_id), gte(t.date, date_from), lte(t.date, date_to)),
				with: { recipe: { with: { ingredients: true } } }
			});

			const items: (typeof shopping_list_item.$inferInsert)[] = [];
			let sort = 0;

			for (const entry of entries) {
				if (entry.recipe?.ingredients) {
					for (const ing of entry.recipe.ingredients) {
						items.push({
							shopping_list_id: list_id,
							name: ing.name,
							quantity: ing.quantity,
							unit: ing.unit,
							recipe_id: entry.recipe_id,
							sort_order: sort++
						});
					}
				}
			}

			if (items.length > 0) {
				await db.insert(shopping_list_item).values(items);
			}
		}

		redirect(303, `/groups/${params.group_id}/shopping/${list_id}`);
	}
};
