<script>
	import Avatar from '$lib/components/Avatar.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';

	export let data;
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
			<code>
				[NAME]: {identity.name}
				[ADMIN?]: {account.admin}
				[PROVIDER]: {identity.provider}
				[PHOTO]: <img class="inline align-top" alt={identity.name} src={identity.photo} />
				[CACHED PHOTO]: <Avatar class="inline align-top" />
				[IDs]: ACCOUNT ID: {account._id}
				IDENTITY ID: {identity._id}

				[ISSUED AT]: {account.iat}
				[EXPIRES AT]: {account.exp}
				<br />
				// eslint-disable-next-line no-alert
				<button on:click={() => alert(data.token)}>Show Token</button>
			</code>
		</section>
	{/if}
	<br />
	<button on:click={() => (location.href = '/identity')}>/identity</button>
	<button on:click={() => (location.href = '/dashboard')}>/dashboard</button>
	<Dropdown placeholder="hewoooooo!!" contents={['blepe', 'blop', 'bloop', 'bleh']} />
</main>

<style lang="postcss">
	code {
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
