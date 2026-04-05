# Page Structure Plan — Feed Me

All routes under `/groups/[group_id]/` are auth-gated and require group membership.
Top-level routes are auth-gated except `/login` and `/register`.

---

## Auth

| Route        | Description                              |
|--------------|------------------------------------------|
| `/login`     | Email + password sign in                 |
| `/register`  | Create a new account                     |

---

## Root

| Route    | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| `/`      | If unauthenticated → redirect to `/login`. If authenticated → redirect to `/groups` |

---

## Groups

| Route          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| `/groups`      | List all groups the user belongs to. Button to create a new group.       |
| `/groups/new`  | Form to create a new group (just a name). Creator is auto-added as member.|

---

## Group — root redirect

| Route                | Description                                                 |
|----------------------|-------------------------------------------------------------|
| `/groups/[group_id]` | Redirects to `/groups/[group_id]/calendar`                  |

---

## Calendar

The primary view for a group. Displays a weekly/monthly grid of meal plan entries.

| Route                          | Description                                                                                  |
|--------------------------------|----------------------------------------------------------------------------------------------|
| `/groups/[group_id]/calendar`  | Calendar grid. Each day shows its meals (breakfast/lunch/dinner/snack). Click a slot to add/edit an entry. Defaults to current week. |

**Interactions handled on this page (no separate sub-routes):**
- Add a meal plan entry (slide-over or inline form) — pick meal type, optionally assign a recipe or free-text title + notes
- Edit / delete an existing entry
- Navigate between weeks/months

---

## Recipes

| Route                                       | Description                                                         |
|---------------------------------------------|---------------------------------------------------------------------|
| `/groups/[group_id]/recipes`                | List of all recipes in the group. Search/filter by name, effort, time. |
| `/groups/[group_id]/recipes/new`            | Form to create a recipe (name, description, servings, time, effort, instructions, ingredients). |
| `/groups/[group_id]/recipes/[recipe_id]`    | View a recipe in full — ingredients, instructions, effort/time.     |
| `/groups/[group_id]/recipes/[recipe_id]/edit` | Edit form (same layout as new).                                   |

---

## Shopping

| Route                                            | Description                                                                                          |
|--------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `/groups/[group_id]/shopping`                    | List of all shopping lists for the group.                                                            |
| `/groups/[group_id]/shopping/new`                | Form to create a shopping list (name, optional date range). Option to auto-populate from meal plan entries in that range. |
| `/groups/[group_id]/shopping/[list_id]`          | The list itself. Items grouped by shop. Check items off, add/remove items, assign a shop to each item. |

---

## Group Settings

| Route                                  | Description                                                                              |
|----------------------------------------|------------------------------------------------------------------------------------------|
| `/groups/[group_id]/settings`          | Rename the group. Danger zone: delete group.                                             |
| `/groups/[group_id]/settings/members`  | List current members. Remove a member. Invite another user (search by name/email, send invite). |
| `/groups/[group_id]/settings/shops`    | List, add, rename, and delete shops for the group.                                       |

---

## Invitations

Pending invites live on the invitee's side, not inside a group.

| Route           | Description                                                                              |
|-----------------|------------------------------------------------------------------------------------------|
| `/invitations`  | List of pending invitations the current user has received. Accept or decline each one.   |

A nav indicator (badge) shows the count of pending invitations.

---

## Navigation Structure

```
Top nav / sidebar
├── /groups                        ← "My Groups"
├── /invitations                   ← "Invitations" (+ badge)
│
└── [when inside a group]
    ├── /groups/[id]/calendar      ← "Calendar"  (default)
    ├── /groups/[id]/recipes       ← "Recipes"
    ├── /groups/[id]/shopping      ← "Shopping"
    └── /groups/[id]/settings      ← "Settings"
```

---

## Key Decisions

1. **Calendar is the home of a group** — it's the most-used view so it's the default landing route for any group.
2. **Meal entries are managed inline on the calendar** — no separate route; a slide-over or modal keeps context.
3. **Shopping list creation page handles auto-population** — the user picks a date range and the server pulls matching meal plan entries to seed the items list, which the user can then trim or add to.
4. **Shops are managed in settings** — they're a configuration concern, not a day-to-day workflow.
5. **Invitations have a dedicated top-level page** — they're cross-group so they don't belong nested under any one group.
6. **No `/groups/[id]/members` top-level route** — member management lives under settings to keep the primary group nav clean.
