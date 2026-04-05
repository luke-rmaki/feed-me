import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	rename: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';

		if (!name) return fail(400, { message: 'Group name is required' });

		await db.update(groups).set({ name }).where(eq(groups.id, params.group_id));

		return { success: true };
	},

	delete: async ({ params }) => {
		await db.delete(groups).where(eq(groups.id, params.group_id));

		redirect(303, '/groups');
	}
};
