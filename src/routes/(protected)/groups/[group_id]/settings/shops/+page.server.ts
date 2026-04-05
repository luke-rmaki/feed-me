import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { shop } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const shops = await db.query.shop.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { asc }) => asc(t.name)
	});

	return { shops };
};

export const actions: Actions = {
	add: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';

		if (!name) return fail(400, { message: 'Shop name is required' });

		await db.insert(shop).values({ group_id: params.group_id, name });

		return { success: true };
	},

	rename: async ({ request, params }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const name = formData.get('name')?.toString().trim() ?? '';

		if (!name) return fail(400, { message: 'Shop name is required' });

		await db
			.update(shop)
			.set({ name })
			.where(and(eq(shop.id, id), eq(shop.group_id, params.group_id)));

		return { success: true };
	},

	delete: async ({ request, params }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';

		await db.delete(shop).where(and(eq(shop.id, id), eq(shop.group_id, params.group_id)));

		return { success: true };
	}
};
