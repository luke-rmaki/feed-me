<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>Sign in</h1>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/signIn" use:enhance>
	<label>
		Email
		<input type="email" name="email" required />
	</label>
	<label>
		Password
		<input type="password" name="password" required />
	</label>
	<button type="submit">Sign in</button>
</form>

<p>No account? <a href="/register">Register</a></p>
