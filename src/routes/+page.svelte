<script>
	import Avatar from '$lib/components/Avatar.svelte';

	export let data;

	const {
		account,
		account: { identity }
	} = data;
</script>

<main>
	{#if data}
		<h1 class="text-2xl">SIGNED IN AS:</h1>
		<div class="yippie" />
		<section>
			<pre>
				[NAME]: {identity.name}
				[ADMIN?]: {account.admin}
				[PROVIDER]: {identity.provider}
				[PHOTO]: <img alt={identity.name} src={identity.photo} />
				[CACHED PHOTO]: <Avatar />
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
	<button on:click={() => (open = !open)}>Toggle Modal</button>
	<button on:click={() => (location.href = '/identity')}>/identity</button>
	<button on:click={() => (location.href = '/dashboard')}>/dashboard</button>
</main>

<style lang="postcss">
	p {
		@apply border border-gray-500 p-10;
		overflow: hidden;
		text-wrap: balance;
	}
	pre {
		@apply font-sans;
	}
	.yippie {
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
