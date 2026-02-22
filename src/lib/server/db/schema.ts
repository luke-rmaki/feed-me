import { integer, real, sqliteTable, text, index, unique } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './auth.schema';

const timestamp_ms = (name: string) => integer(name, { mode: 'timestamp_ms' });
const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export const groups = sqliteTable('groups', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	created_by: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	created_at: timestamp_ms('created_at').default(now).notNull(),
	updated_at: timestamp_ms('updated_at')
		.default(now)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const group_member = sqliteTable(
	'group_member',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		group_id: text('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		joined_at: timestamp_ms('joined_at').default(now).notNull()
	},
	(t) => [unique().on(t.group_id, t.user_id)]
);

export const group_invitation = sqliteTable(
	'group_invitation',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		group_id: text('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		invited_by: text('invited_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		invitee_id: text('invitee_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		status: text('status', { enum: ['pending', 'accepted', 'declined'] })
			.notNull()
			.default('pending'),
		created_at: timestamp_ms('created_at').default(now).notNull()
	},
	(t) => [unique().on(t.group_id, t.invitee_id)]
);

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

export const recipe = sqliteTable('recipe', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	group_id: text('group_id')
		.notNull()
		.references(() => groups.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	created_by: text('created_by').references(() => user.id, { onDelete: 'set null' }),
	servings: integer('servings').default(4),
	time_minutes: integer('time_minutes'),
	effort: integer('effort'),
	instructions: text('instructions'),
	created_at: timestamp_ms('created_at').default(now).notNull(),
	updated_at: timestamp_ms('updated_at')
		.default(now)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const recipe_ingredient = sqliteTable('recipe_ingredient', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	recipe_id: text('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	quantity: real('quantity'),
	unit: text('unit'),
	notes: text('notes'),
	sort_order: integer('sort_order').notNull().default(0)
});

// ---------------------------------------------------------------------------
// Meal plan
// ---------------------------------------------------------------------------

export const meal_plan_entry = sqliteTable(
	'meal_plan_entry',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		group_id: text('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		date: text('date').notNull(), // YYYY-MM-DD
		meal_type: text('meal_type', {
			enum: ['breakfast', 'lunch', 'dinner', 'snack']
		}).notNull(),
		recipe_id: text('recipe_id').references(() => recipe.id, { onDelete: 'set null' }),
		title: text('title'),
		notes: text('notes'),
		created_at: timestamp_ms('created_at').default(now).notNull(),
		updated_at: timestamp_ms('updated_at')
			.default(now)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(t) => [index('meal_plan_entry_group_date_idx').on(t.group_id, t.date)]
);

// ---------------------------------------------------------------------------
// Shopping
// ---------------------------------------------------------------------------

export const shop = sqliteTable('shop', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	group_id: text('group_id')
		.notNull()
		.references(() => groups.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	created_at: timestamp_ms('created_at').default(now).notNull(),
	updated_at: timestamp_ms('updated_at')
		.default(now)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const shopping_list = sqliteTable('shopping_list', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	group_id: text('group_id')
		.notNull()
		.references(() => groups.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	date_from: text('date_from'),
	date_to: text('date_to'),
	created_at: timestamp_ms('created_at').default(now).notNull(),
	updated_at: timestamp_ms('updated_at')
		.default(now)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const shopping_list_item = sqliteTable('shopping_list_item', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	shopping_list_id: text('shopping_list_id')
		.notNull()
		.references(() => shopping_list.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	quantity: real('quantity'),
	unit: text('unit'),
	checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
	shop_id: text('shop_id').references(() => shop.id, { onDelete: 'set null' }),
	recipe_id: text('recipe_id').references(() => recipe.id, { onDelete: 'set null' }),
	notes: text('notes'),
	sort_order: integer('sort_order').notNull().default(0),
	created_at: timestamp_ms('created_at').default(now).notNull(),
	updated_at: timestamp_ms('updated_at')
		.default(now)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const groups_relations = relations(groups, ({ one, many }) => ({
	creator: one(user, { fields: [groups.created_by], references: [user.id] }),
	members: many(group_member),
	invitations: many(group_invitation),
	recipes: many(recipe),
	meal_plan_entries: many(meal_plan_entry),
	shops: many(shop),
	shopping_lists: many(shopping_list)
}));

export const group_member_relations = relations(group_member, ({ one }) => ({
	group: one(groups, { fields: [group_member.group_id], references: [groups.id] }),
	user: one(user, { fields: [group_member.user_id], references: [user.id] })
}));

export const group_invitation_relations = relations(group_invitation, ({ one }) => ({
	group: one(groups, { fields: [group_invitation.group_id], references: [groups.id] }),
	invited_by: one(user, { fields: [group_invitation.invited_by], references: [user.id] }),
	invitee: one(user, { fields: [group_invitation.invitee_id], references: [user.id] })
}));

export const recipe_relations = relations(recipe, ({ one, many }) => ({
	group: one(groups, { fields: [recipe.group_id], references: [groups.id] }),
	creator: one(user, { fields: [recipe.created_by], references: [user.id] }),
	ingredients: many(recipe_ingredient),
	meal_plan_entries: many(meal_plan_entry),
	shopping_list_items: many(shopping_list_item)
}));

export const recipe_ingredient_relations = relations(recipe_ingredient, ({ one }) => ({
	recipe: one(recipe, { fields: [recipe_ingredient.recipe_id], references: [recipe.id] })
}));

export const meal_plan_entry_relations = relations(meal_plan_entry, ({ one }) => ({
	group: one(groups, { fields: [meal_plan_entry.group_id], references: [groups.id] }),
	recipe: one(recipe, { fields: [meal_plan_entry.recipe_id], references: [recipe.id] })
}));

export const shop_relations = relations(shop, ({ one, many }) => ({
	group: one(groups, { fields: [shop.group_id], references: [groups.id] }),
	shopping_list_items: many(shopping_list_item)
}));

export const shopping_list_relations = relations(shopping_list, ({ one, many }) => ({
	group: one(groups, { fields: [shopping_list.group_id], references: [groups.id] }),
	items: many(shopping_list_item)
}));

export const shopping_list_item_relations = relations(shopping_list_item, ({ one }) => ({
	shopping_list: one(shopping_list, {
		fields: [shopping_list_item.shopping_list_id],
		references: [shopping_list.id]
	}),
	shop: one(shop, { fields: [shopping_list_item.shop_id], references: [shop.id] }),
	recipe: one(recipe, { fields: [shopping_list_item.recipe_id], references: [recipe.id] })
}));

export * from './auth.schema';
