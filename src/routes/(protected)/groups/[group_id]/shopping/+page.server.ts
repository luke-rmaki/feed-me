import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const lists = await db.query.shopping_list.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { desc }) => desc(t.created_at)
	});

	return { lists };
};
