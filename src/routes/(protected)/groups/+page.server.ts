import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { groups, group_member } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user_groups = await db
		.select({ id: groups.id, name: groups.name })
		.from(group_member)
		.innerJoin(groups, eq(group_member.group_id, groups.id))
		.where(eq(group_member.user_id, locals.user!.id));

	return { groups: user_groups };
};
