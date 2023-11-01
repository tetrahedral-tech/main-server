<script>
	import Avatar from '$lib/components/Avatar.svelte';

	export let data;
	let id = data.account.identity;
	let open;
</script>

<main>
	{#if data && data.success}
		{@const {
			account,
			account: { identity }
		} = data}
		<h1 class="text-2xl">SIGNED IN AS:</h1>
		<div class="happy" />
		<section>
			<pre>
				[NAME]: {identity.name}
				[ADMIN?]: {account.admin}
				[PROVIDER]: {identity.provider}
				[PHOTO]: <img class="inline align-top" alt={identity.name} src={identity.photo} />
				[CACHED PHOTO]: <Avatar class="inline align-top" />
				[IDs]: 
					ACCOUNT ID: {account._id}
					IDENTITY ID: {identity._id}

				[ISSUED AT]: {account.iat}
				[EXPIRES AT]: {account.exp}

				{data.token}
			</pre>
		</section>
	{/if}
	<br />
	<button on:click={() => (location.href = '/identity')}>/identity</button>
	<button on:click={() => (location.href = '/dashboard')}>/dashboard</button>
</main>

<style lang="postcss">
	pre {
		@apply font-sans;
	}
	.happy {
		content: '';
		position: absolute;
		height: 177px;
		width: 177px;
		background: url('happy.png');
		background-size: contain;
		background-repeat: no-repeat;
		position: absolute;
		z-index: -1;
		bottom: 0;
	}
</style>
