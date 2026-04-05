import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
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
	delete: async ({ params }) => {
		await db
			.delete(recipe)
			.where(and(eq(recipe.id, params.recipe_id), eq(recipe.group_id, params.group_id)));

		redirect(303, `/groups/${params.group_id}/recipes`);
	}
};
