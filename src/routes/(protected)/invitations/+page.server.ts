import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { group_member, group_invitation } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');

	const invitations = await db.query.group_invitation.findMany({
		where: (t, { and, eq }) =>
			and(eq(t.invitee_id, locals.user!.id), eq(t.status, 'pending')),
		with: {
			group: true,
			invited_by: true
		}
	});

	return { invitations };
};

export const actions: Actions = {
	accept: async ({ request, locals }) => {
		if (!locals.user) redirect(303, '/login');

		const formData = await request.formData();
		const invitation_id = formData.get('invitation_id')?.toString() ?? '';

		const invitation = await db.query.group_invitation.findFirst({
			where: (t, { and, eq }) =>
				and(eq(t.id, invitation_id), eq(t.invitee_id, locals.user!.id), eq(t.status, 'pending'))
		});

		if (!invitation) error(404, 'Invitation not found');

		await db
			.insert(group_member)
			.values({ group_id: invitation.group_id, user_id: locals.user.id })
			.onConflictDoNothing();

		await db
			.update(group_invitation)
			.set({ status: 'accepted' })
			.where(eq(group_invitation.id, invitation_id));

		return { success: true };
	},

	decline: async ({ request, locals }) => {
		if (!locals.user) redirect(303, '/login');

		const formData = await request.formData();
		const invitation_id = formData.get('invitation_id')?.toString() ?? '';

		await db
			.update(group_invitation)
			.set({ status: 'declined' })
			.where(
				and(
					eq(group_invitation.id, invitation_id),
					eq(group_invitation.invitee_id, locals.user.id)
				)
			);

		return { success: true };
	}
};
