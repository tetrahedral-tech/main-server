<script>
	import { PUBLIC_PUSH_SERVER_KEY } from '$env/static/public';
	import { pushSupported } from '$lib/push';
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let data;
	const registerForm = {
		endpoint: null,
		auth: null,
		p256dh: null,
		submit: null
	};

	let swRegistration;
	const swRegistrationColor = () => {
		if (swRegistration.active) return 'border-green';
		if (swRegistration.installing || swRegistration.waiting) return 'border-yellow';
		return 'border-red';
	};

	const register = async () => {
		if (Notification.permission !== 'granted')
			if ((await Notification.requestPermission()) === 'denied') return;

		const subscription = await swRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_PUSH_SERVER_KEY
		});

		const {
			endpoint,
			keys: { p256dh, auth }
		} = JSON.parse(JSON.stringify(subscription));

		registerForm.endpoint.value = endpoint;
		registerForm.p256dh.value = p256dh;
		registerForm.auth.value = auth;
		registerForm.submit.click();
	};

	onMount(async () => (swRegistration = await navigator.serviceWorker.getRegistration()));
</script>

<main>
	<form class="hidden" action="?/register" method="post" use:enhance>
		<input type="text" name="endpoint" bind:this={registerForm.endpoint} />
		<input type="text" name="auth" bind:this={registerForm.auth} />
		<input type="text" name="p256dh" bind:this={registerForm.p256dh} />
		<button type="submit" bind:this={registerForm.submit} />
	</form>

	{#if pushSupported && Notification.permission === 'denied'}
		<section class="border-yellow">
			<h2>Notifications Denied</h2>
		</section>
	{/if}

	{#if !pushSupported}
		<section class="border-red">
			<h2>You are not on a browser that supports Push Notifications!</h2>
			<br />
			<button on:click={() => (location.href = 'https://www.mozilla.org/en-US/firefox/new/')}>
				Switch to Mozilla Firefox
			</button>
			<button on:click={() => (location.href = 'https://www.google.com/chrome/')}>
				Switch to Google Chrome
			</button>
		</section>
	{:else if Notification.permission === 'default'}
		<section class="border-yellow">
			<h2>Notifications are not enabled!</h2>
			<button on:click={register}>Enable Notifications</button>
		</section>
	{:else if !swRegistration}
		<section class="border-red">
			<h2>ServiceWorker is erroring</h2>
			{#if dev}
				<p>Try using a Chromium based browser for ServiceWorkers while in Dev Mode</p>
				<br />
				<button
					on:click={() =>
						(location.href = 'https://www.chromium.org/getting-involved/download-chromium/')}
				>
					Switch to Chromium
				</button>
			{/if}
		</section>
	{/if}

	{#if swRegistration}
		<section class={swRegistrationColor(swRegistration)}>
			{#if swRegistration.installing}
				<p>ServiceWorker Installing...</p>
			{:else if swRegistration.waiting}
				<p>ServiceWorker Installed</p>
			{:else if swRegistration.active}
				<p>ServiceWorker Active</p>
			{:else}
				<p class="text-red">ServiceWorker Unknown</p>
			{/if}
		</section>
	{/if}

	{#if !data.registered}
		<section class="border-red">
			<h2>Unregistered</h2>
			<button on:click={register}>Register</button>
		</section>
	{:else}
		<section>
			<form action="?/test" method="post" use:enhance>
				<button type="submit">Send Test Notification</button>
			</form>
		</section>
	{/if}
</main>
