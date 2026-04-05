import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { meal_plan_entry } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

const meal_types = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
type MealType = (typeof meal_types)[number];

function get_week_start(week_param: string | null): string {
	let date: Date;
	if (week_param) {
		const [year, month, day] = week_param.split('-').map(Number);
		date = new Date(year, month - 1, day);
	} else {
		date = new Date();
	}
	const day_of_week = date.getDay();
	const diff = day_of_week === 0 ? -6 : 1 - day_of_week;
	date.setDate(date.getDate() + diff);
	const year_str = date.getFullYear();
	const month_str = String(date.getMonth() + 1).padStart(2, '0');
	const day_str = String(date.getDate()).padStart(2, '0');
	return `${year_str}-${month_str}-${day_str}`;
}

function add_days(date_str: string, days: number): string {
	const [year, month, day] = date_str.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	date.setDate(date.getDate() + days);
	const year_str = date.getFullYear();
	const month_str = String(date.getMonth() + 1).padStart(2, '0');
	const day_str = String(date.getDate()).padStart(2, '0');
	return `${year_str}-${month_str}-${day_str}`;
}

export const load: PageServerLoad = async ({ params, url }) => {
	const week_start = get_week_start(url.searchParams.get('week'));
	const week_end = add_days(week_start, 6);
	const today = get_week_start(null);

	const entries = await db.query.meal_plan_entry.findMany({
		where: (t, { and, eq, gte, lte }) =>
			and(eq(t.group_id, params.group_id), gte(t.date, week_start), lte(t.date, week_end)),
		with: { recipe: true }
	});

	const recipes = await db.query.recipe.findMany({
		where: (t, { eq }) => eq(t.group_id, params.group_id),
		orderBy: (t, { asc }) => asc(t.name)
	});

	return { entries, recipes, week_start, week_end, today };
};

export const actions: Actions = {
	add_entry: async ({ request, params }) => {
		const formData = await request.formData();
		const date = formData.get('date')?.toString() ?? '';
		const raw_meal_type = formData.get('meal_type')?.toString() ?? '';
		const recipe_id = formData.get('recipe_id')?.toString() || null;
		const title = formData.get('title')?.toString() || null;
		const notes = formData.get('notes')?.toString() || null;

		if (!date || !raw_meal_type) return fail(400, { message: 'Date and meal type are required' });
		if (!meal_types.includes(raw_meal_type as MealType))
			return fail(400, { message: 'Invalid meal type' });

		const meal_type = raw_meal_type as MealType;

		await db.insert(meal_plan_entry).values({
			group_id: params.group_id,
			date,
			meal_type,
			recipe_id,
			title,
			notes
		});

		return { success: true };
	},

	delete_entry: async ({ request, params }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';

		await db
			.delete(meal_plan_entry)
			.where(and(eq(meal_plan_entry.id, id), eq(meal_plan_entry.group_id, params.group_id)));

		return { success: true };
	}
};
