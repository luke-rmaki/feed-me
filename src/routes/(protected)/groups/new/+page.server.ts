import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { groups, group_member } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';

		if (!name) return fail(400, { message: 'Group name is required' });

		const group_id = crypto.randomUUID();

		await db.insert(groups).values({ id: group_id, name, created_by: locals.user!.id });
		await db.insert(group_member).values({ group_id, user_id: locals.user!.id });

		redirect(303, `/groups/${group_id}/calendar`);
	}
};
