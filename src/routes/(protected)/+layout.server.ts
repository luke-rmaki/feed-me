import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { group_invitation } from '$lib/server/db/schema';
import { and, count, eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');

	const [{ pending_count }] = await db
		.select({ pending_count: count() })
		.from(group_invitation)
		.where(
			and(eq(group_invitation.invitee_id, locals.user.id), eq(group_invitation.status, 'pending'))
		);

	return { user: locals.user, pending_count };
};
