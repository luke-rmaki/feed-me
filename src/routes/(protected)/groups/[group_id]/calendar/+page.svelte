<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const meal_types = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
	const day_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function parse_date(date_str: string): Date {
		const [year, month, day] = date_str.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	function add_days(date_str: string, days: number): string {
		const date = parse_date(date_str);
		date.setDate(date.getDate() + days);
		const year_str = date.getFullYear();
		const month_str = String(date.getMonth() + 1).padStart(2, '0');
		const day_str = String(date.getDate()).padStart(2, '0');
		return `${year_str}-${month_str}-${day_str}`;
	}

	function format_day(date_str: string): string {
		const date = parse_date(date_str);
		const day_name = day_names[date.getDay()];
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		return `${day_name} ${day}/${month}`;
	}

	const days = $derived(Array.from({ length: 7 }, (_, i) => add_days(data.week_start, i)));
	const prev_week = $derived(add_days(data.week_start, -7));
	const next_week = $derived(add_days(data.week_start, 7));

	function entries_for(date: string, meal_type: string) {
		return data.entries.filter((e) => e.date === date && e.meal_type === meal_type);
	}
</script>

<div>
	<a href="?week={prev_week}">← Prev</a>
	Week of {data.week_start}
	<a href="?week={next_week}">Next →</a>
	<a href="?week={data.today}">Today</a>
</div>

<div style="display:grid; grid-template-columns: auto repeat(7, 1fr); gap: 4px;">
	<div></div>
	{#each days as day}
		<div><strong>{format_day(day)}</strong></div>
	{/each}

	{#each meal_types as meal_type}
		<div><strong>{meal_type}</strong></div>
		{#each days as day}
			<div style="border: 1px solid #ccc; padding: 4px; min-height: 60px;">
				{#each entries_for(day, meal_type) as entry}
					<div>
						{entry.recipe?.name ?? entry.title ?? '—'}
						<form method="post" action="?/delete_entry" use:enhance style="display:inline">
							<input type="hidden" name="id" value={entry.id} />
							<button type="submit">×</button>
						</form>
					</div>
				{/each}
				<form method="post" action="?/add_entry" use:enhance>
					<input type="hidden" name="date" value={day} />
					<input type="hidden" name="meal_type" value={meal_type} />
					<select name="recipe_id">
						<option value="">— recipe —</option>
						{#each data.recipes as recipe}
							<option value={recipe.id}>{recipe.name}</option>
						{/each}
					</select>
					<input type="text" name="title" placeholder="or custom title" />
					<button type="submit">Add</button>
				</form>
			</div>
		{/each}
	{/each}
</div>
