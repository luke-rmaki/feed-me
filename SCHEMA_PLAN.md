# Schema Plan — Feed Me

## Overview

Builds on the existing Better-Auth tables (`user`, `session`, `account`, `verification`).
All new tables use `crypto.randomUUID()` for IDs and follow the same timestamp conventions.

---

## New Tables

### `group`

A named household / family / friend group that shares a meal calendar.

| Column       | Type        | Notes                              |
|--------------|-------------|------------------------------------|
| id           | text PK     | UUID                               |
| name         | text        | NOT NULL                           |
| created_by   | text FK     | → user.id, cascade delete          |
| created_at   | timestamp   |                                    |
| updated_at   | timestamp   |                                    |

---

### `group_member`

Junction table: which users belong to which groups, and with what role.

| Column    | Type      | Notes                       |
|-----------|-----------|-----------------------------|
| id        | text PK   | UUID                        |
| group_id  | text FK   | → group.id, cascade delete  |
| user_id   | text FK   | → user.id, cascade delete   |
| joined_at | timestamp |                             |

Unique constraint: `(group_id, user_id)`.

---

### `group_invitation`

Invite an existing registered user to join a group.

| Column      | Type      | Notes                                         |
|-------------|-----------|-----------------------------------------------|
| id          | text PK   | UUID                                          |
| group_id    | text FK   | → group.id, cascade delete                    |
| invited_by  | text FK   | → user.id, cascade delete                     |
| invitee_id  | text FK   | → user.id, cascade delete                     |
| status      | text      | `'pending' \| 'accepted' \| 'declined'`       |
| created_at  | timestamp |                                               |

Unique constraint: `(group_id, invitee_id)` — one pending invite per user per group.

---

### `recipe`

Recipes belong to a group and are visible to all group members.

| Column        | Type      | Notes                              |
|---------------|-----------|------------------------------------|
| id            | text PK   | UUID                               |
| group_id      | text FK   | → group.id, cascade delete         |
| name          | text      | NOT NULL                           |
| description   | text      | Nullable                           |
| created_by    | text FK   | → user.id, set null on delete      |
| servings      | integer   | Default 4                          |
| time_minutes  | integer   | Total time; nullable               |
| effort        | integer   | 1–10 scale; nullable               |
| instructions  | text      | Free text or JSON steps; nullable  |
| created_at    | timestamp |                                    |
| updated_at    | timestamp |                                    |

---

### `recipe_ingredient`

Ordered list of ingredients for a recipe.

| Column     | Type    | Notes                              |
|------------|---------|------------------------------------|
| id         | text PK | UUID                               |
| recipe_id  | text FK | → recipe.id, cascade delete        |
| name       | text    | NOT NULL                           |
| quantity   | real    | Nullable (e.g. "a pinch of…")     |
| unit       | text    | Nullable (cups, grams, ml, …)     |
| notes      | text    | Nullable (e.g. "finely chopped")  |
| sort_order | integer | Display ordering within the recipe |

---

### `meal_plan_entry`

One slot on a group's shared calendar. Each entry is a date + meal type.
A recipe is optional so you can plan a meal without one attached yet.

| Column     | Type      | Notes                                            |
|------------|-----------|--------------------------------------------------|
| id         | text PK   | UUID                                             |
| group_id   | text FK   | → group.id, cascade delete                       |
| date       | text      | ISO date string `YYYY-MM-DD`                     |
| meal_type  | text      | `'breakfast' \| 'lunch' \| 'dinner' \| 'snack'` |
| recipe_id  | text FK   | → recipe.id, set null on delete; nullable        |
| title      | text      | Free-text label when no recipe assigned          |
| notes      | text      | Nullable                                         |
| created_at | timestamp |                                                  |
| updated_at | timestamp |                                                  |

Index on `(group_id, date)` for efficient calendar range queries.

---

### `shopping_list`

A named list scoped to a group, optionally tied to a date range of meal plan entries.

| Column     | Type      | Notes                               |
|------------|-----------|-------------------------------------|
| id         | text PK   | UUID                                |
| group_id   | text FK   | → group.id, cascade delete          |
| name       | text      | NOT NULL (e.g. "Week of Feb 22")    |
| date_from  | text      | ISO date; nullable                  |
| date_to    | text      | ISO date; nullable                  |
| created_at | timestamp |                                     |
| updated_at | timestamp |                                     |

---

### `shop`

A named shop belonging to a group (e.g. "Tesco", "Farmers Market").

| Column     | Type      | Notes                       |
|------------|-----------|-----------------------------|
| id         | text PK   | UUID                        |
| group_id   | text FK   | → group.id, cascade delete  |
| name       | text      | NOT NULL                    |
| created_at | timestamp |                             |
| updated_at | timestamp |                             |

---

### `shopping_list_item`

Individual line items in a shopping list. Can be generated from recipe ingredients
or added manually.

| Column           | Type      | Notes                                      |
|------------------|-----------|--------------------------------------------|
| id               | text PK   | UUID                                       |
| shopping_list_id | text FK   | → shopping_list.id, cascade delete         |
| name             | text      | NOT NULL                                   |
| quantity         | real      | Nullable                                   |
| unit             | text      | Nullable                                   |
| checked          | integer   | Boolean, default 0                         |
| shop_id          | text FK   | → shop.id, set null on delete; nullable    |
| recipe_id        | text FK   | → recipe.id, set null on delete; nullable  |
| notes            | text      | Nullable                                   |
| sort_order       | integer   | Display ordering within the list           |
| created_at       | timestamp |                                            |
| updated_at       | timestamp |                                            |

---

## Relationship Summary

```
user ─< group_member >─ group ─┬─< recipe ─< recipe_ingredient
                                ├─< meal_plan_entry
                                ├─< shop
                                ├─< shopping_list ─< shopping_list_item
                                └─< group_invitation
```

- A **user** joins many **groups** (via `group_member`); a group has many members.
- A **group** owns all **recipes**, **meal_plan_entries**, **shops**, and **shopping_lists**.
- A **meal_plan_entry** optionally references a **recipe** in the same group.
- A **recipe** has many **recipe_ingredients**.
- A **shop** belongs to a group and can be assigned to **shopping_list_items**.
- A **shopping_list** has many **shopping_list_items**, each optionally tracing back to a **recipe** and a **shop**.

---

## Key Design Decisions

1. **Recipes are group-owned** — no personal recipes; all recipes live under a group.
2. **No roles** — all group members are equal; no owner/admin/member distinction.
3. **Invitations are user-to-user** — only existing registered users can be invited; no email tokens or unregistered invitees.
4. **`meal_plan_entry` has no `created_by`** — meals belong to the group, not a specific member.
5. **Single calendar per group** — no separate "meal plan" container; entries reference the group and a date directly.
6. **Shopping lists are manual + generated** — a user creates one and optionally auto-populates it from a date range of meal plan entries.
7. **`meal_type` is a text enum** — `breakfast`, `lunch`, `dinner`, `snack`; no lookup table needed.
8. **Cascade deletes** — group deletion cascades to everything beneath it. Recipe deletion nullifies FK refs on `meal_plan_entry` and `shopping_list_item` to preserve history.
