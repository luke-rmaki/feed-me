<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="auth-wrapper">
	<div class="auth-card">
		<h1>Register</h1>

		{#if form?.message}
			<p class="message error">{form.message}</p>
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
			<button type="submit" class="primary">Register</button>
		</form>

		<p>Already have an account? <a href="/login">Sign in</a></p>
	</div>
</div>
