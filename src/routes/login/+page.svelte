<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="auth-wrapper">
	<div class="auth-card">
		<h1>Sign in</h1>

		{#if form?.message}
			<p class="message error">{form.message}</p>
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
			<button type="submit" class="primary">Sign in</button>
		</form>

		<p>No account? <a href="/register">Register</a></p>
	</div>
</div>
