import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { shopping_list_item } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const list = await db.query.shopping_list.findFirst({
		where: (t, { and, eq }) =>
			and(eq(t.id, params.list_id), eq(t.group_id, params.group_id)),
		with: {
			items: {
				orderBy: (t, { asc }) => asc(t.sort_order),
				with: { shop: true, recipe: true }
			}
		}
	});

	if (!list) error(404, 'Shopping list not found');

	const shops = await db.query.shop.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { asc }) => asc(t.name)
	});

	return { list, shops };
};

export const actions: Actions = {
	add_item: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const quantity = Number(formData.get('quantity')) || null;
		const unit = formData.get('unit')?.toString() || null;
		const shop_id = formData.get('shop_id')?.toString() || null;

		if (!name) return fail(400, { message: 'Item name is required' });

		await db.insert(shopping_list_item).values({
			shopping_list_id: params.list_id,
			name,
			quantity,
			unit,
			shop_id
		});

		return { success: true };
	},

	toggle_item: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const checked = formData.get('checked') === 'true';

		await db
			.update(shopping_list_item)
			.set({ checked: !checked })
			.where(eq(shopping_list_item.id, id));

		return { success: true };
	},

	delete_item: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';

		await db.delete(shopping_list_item).where(eq(shopping_list_item.id, id));

		return { success: true };
	}
};
