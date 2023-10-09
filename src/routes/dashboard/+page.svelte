<script>
	import { enhance } from '$app/forms';
	import Graph from './Graph.svelte';

	export let data;
</script>

<main>
	<form method="post" use:enhance>
		<input type="text" name="id" placeholder="ID" />
		<input type="number" name="strengthToUSD" placeholder="1.0 Strength -> USD" />
		<input type="text" name="algorithm" placeholder="Algorithm" /><br />
		<button formaction="/bots?/create">Create Bot</button>
		<button formaction="/bots?/update">Update Bot</button>
		<button formaction="/bots?/delete">Delete Bot</button>
	</form>

	{#each data.accounts as { address, privateKey, balance, id }}
		<code>{address}</code><br />
		{#if privateKey}
			<code class="private"><span>{privateKey}</span></code><br />
		{/if}
		<span class="balance">Net Worth: {balance} USD</span><br />
		<Graph token={data.token} path={`worth/${id}`} />
	{/each}
</main>

<style>
	.balance {
		color: #4e4e4e;
		font-size: 16px;
		font-style: italic;
	}

	.private {
		user-select: none;
		color: #3e3e3e;
		background-color: #3e3e3e;
		border-radius: 2px;
		transition:
			color 0.2s,
			background-color 0.2s;
	}

	.private:hover {
		user-select: initial;
		color: initial;
		background-color: initial;
	}
</style>
