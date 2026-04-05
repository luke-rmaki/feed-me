<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>Register</h1>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/register" use:enhance>
	<label>
		Name
		<input type="text" name="name" required />
	</label>
	<label>
		Email
		<input type="email" name="email" required />
	</label>
	<label>
		Password
		<input type="password" name="password" required minlength="8" />
	</label>
	<button type="submit">Register</button>
</form>

<p>Already have an account? <a href="/login">Sign in</a></p>
