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

<div class="page" style="max-width:none;">
	<div class="page-header">
		<h2>Calendar</h2>
		<div class="week-nav">
			<a href="?week={prev_week}" class="button">← Prev</a>
			<span class="week-label">Week of {data.week_start}</span>
			<a href="?week={next_week}" class="button">Next →</a>
			<a href="?week={data.today}" class="button primary">Today</a>
		</div>
	</div>

	<div class="calendar-grid">
		<div class="calendar-corner"></div>
		{#each days as day}
			<div class="calendar-day-header">{format_day(day)}</div>
		{/each}

		{#each meal_types as meal_type}
			<div class="calendar-meal-label">{meal_type}</div>
			{#each days as day}
				<div class="calendar-cell">
					{#each entries_for(day, meal_type) as entry}
						<div class="calendar-entry">
							<span>{entry.recipe?.name ?? entry.title ?? '—'}</span>
							<form method="post" action="?/delete_entry" use:enhance>
								<input type="hidden" name="id" value={entry.id} />
								<button type="submit" class="entry-delete" aria-label="Remove">×</button>
							</form>
						</div>
					{/each}
					<form method="post" action="?/add_entry" use:enhance class="add-entry-form">
						<input type="hidden" name="date" value={day} />
						<input type="hidden" name="meal_type" value={meal_type} />
						<select name="recipe_id">
							<option value="">— recipe —</option>
							{#each data.recipes as recipe}
								<option value={recipe.id}>{recipe.name}</option>
							{/each}
						</select>
						<input type="text" name="title" placeholder="or custom…" />
						<button type="submit">Add</button>
					</form>
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.week-nav {
		display: flex;
		align-items: center;
		gap: var(--vs-s);
		flex-wrap: wrap;
	}

	.week-label {
		color: var(--fg-5);
		font-size: 0.9rem;
		padding: 0 var(--pad-xs);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: 90px repeat(7, 1fr);
		gap: 1px;
		background: var(--fg-2);
		border: 1px solid var(--fg-2);
		border-radius: var(--br-m);
		overflow: hidden;
		font-size: 0.85rem;
	}

	.calendar-corner,
	.calendar-day-header,
	.calendar-meal-label,
	.calendar-cell {
		background: var(--bg);
	}

	.calendar-corner {
		background: var(--fg-05);
	}

	.calendar-day-header {
		padding: var(--pad-s) var(--pad-m);
		font-weight: 600;
		font-size: 0.8rem;
		text-align: center;
		background: var(--fg-05);
		color: var(--fg-7);
	}

	.calendar-meal-label {
		padding: var(--pad-m);
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-5);
		display: flex;
		align-items: flex-start;
		background: var(--fg-05);
	}

	.calendar-cell {
		padding: var(--pad-s);
		min-height: 80px;
		display: flex;
		flex-direction: column;
		gap: var(--vs-xs);
	}

	.calendar-entry {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--vs-xs);
		background: var(--primary-1);
		border: 1px solid var(--primary-2);
		border-radius: var(--br-s);
		padding: 2px var(--pad-xs);
		font-size: 0.8rem;
		color: var(--fg-8);
	}

	.entry-delete {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0 2px;
		color: var(--fg-4);
		font-size: 0.9rem;
		line-height: 1;
		border-radius: 2px;
		box-shadow: none;
		min-width: unset;
	}

	.entry-delete:hover {
		color: var(--red);
		background: var(--red-1);
	}

	.add-entry-form {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: auto;
	}

	.add-entry-form select,
	.add-entry-form input {
		font-size: 0.75rem;
		padding: 2px var(--pad-xs);
		line-height: 1.4;
		height: auto;
	}

	.add-entry-form button {
		font-size: 0.75rem;
		padding: 2px var(--pad-s);
		align-self: flex-start;
	}
</style>
