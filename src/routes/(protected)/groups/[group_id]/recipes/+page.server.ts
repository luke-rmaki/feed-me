import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const recipes = await db.query.recipe.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { asc }) => asc(t.name)
	});

	return { recipes };
};
