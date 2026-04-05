import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { group_member, group_invitation } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const members = await db.query.group_member.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		with: { user: true }
	});

	const invitations = await db.query.group_invitation.findMany({
		where: (t, { and, eq }) =>
			and(eq(t.group_id, params.group_id), eq(t.status, 'pending')),
		with: { invitee: true }
	});

	return { members, invitations };
};

export const actions: Actions = {
	invite: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';

		if (!email) return fail(400, { message: 'Email is required' });

		const invitee = await db.query.user.findFirst({
			where: (t, { eq }) => eq(t.email, email)
		});

		if (!invitee) return fail(404, { message: 'No user found with that email' });

		const existing_member = await db.query.group_member.findFirst({
			where: (t, { and, eq }) =>
				and(eq(t.group_id, params.group_id), eq(t.user_id, invitee.id))
		});

		if (existing_member) return fail(400, { message: 'User is already a member' });

		try {
			await db.insert(group_invitation).values({
				group_id: params.group_id,
				invited_by: locals.user!.id,
				invitee_id: invitee.id
			});
		} catch {
			return fail(400, { message: 'User already has a pending invitation' });
		}

		return { success: true };
	},

	remove_member: async ({ request, params }) => {
		const formData = await request.formData();
		const user_id = formData.get('user_id')?.toString() ?? '';

		await db
			.delete(group_member)
			.where(and(eq(group_member.group_id, params.group_id), eq(group_member.user_id, user_id)));

		return { success: true };
	},

	cancel_invitation: async ({ request, params }) => {
		const formData = await request.formData();
		const invitation_id = formData.get('invitation_id')?.toString() ?? '';

		await db
			.delete(group_invitation)
			.where(
				and(
					eq(group_invitation.id, invitation_id),
					eq(group_invitation.group_id, params.group_id)
				)
			);

		return { success: true };
	}
};
