<script>
	import Modal from '$lib/components/Modal.svelte';

	export let data;
	let id = data.account.identity;
	let open = true;
</script>

<main>
	{#if data}
		<Modal bind:open>
			{#if data.success}
				<div class="success">
					<span style="word-wrap: anywhere;">{data.token}</span>
					<br />
					<p>{JSON.stringify(data.account)}</p>
				</div>
			{:else}
				<div class="error">
					<span>{data.error}</span>
					{#if data.detailed}
						<br />
						<code>{data.detailed}</code>
					{/if}
				</div>
			{/if}
		</Modal>
		<h1 class="text-2xl">SIGNED IN AS:</h1>
		<div class="yippie"></div>
		<section>
			<pre>
[NAME]: {id.name}
[ADMIN?]: {data.account.admin}
[IDs]: 
	ACCOUNT ID: {id._id}
	??????? ID: {data.account._id}
[IAT]: {data.account.iat}</pre>
		</section>
	{/if}
	<br>
	<button on:click={() => (open = !open)}>Toggle Modal</button>
	<button on:click={() => (location.href = "/identity")}>/identity</button>
	<button on:click={() => (location.href = "/dashboard")}>/dashboard</button>
</main>

<style lang="postcss">
	p {
		@apply p-10 border border-gray-500;
		overflow: hidden;
		text-wrap: balance;
	}
	pre {
		@apply font-sans;
	}
	.yippie {
		content:'';
		position: absolute;
		height:177px;
		width:177px;
		background: url('https://cdn.discordapp.com/avatars/1096253197338808332/c6e2c05a0c80b68c09e55d821f3ec86b.webp?size=1024'); background-size:contain; background-repeat:no-repeat; position:absolute;
		z-index: -1;
		bottom:0;
	}
</style>