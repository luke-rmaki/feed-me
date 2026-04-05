import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	if (!locals.user) redirect(303, '/login');

	const membership = await db.query.group_member.findFirst({
		where: (t, { and, eq }) =>
			and(eq(t.group_id, params.group_id), eq(t.user_id, locals.user!.id))
	});

	if (!membership) error(403, 'Not a member of this group');

	const group = await db.query.groups.findFirst({
		where: (t, { eq }) => eq(t.id, params.group_id)
	});

	if (!group) error(404, 'Group not found');

	return { group };
};
