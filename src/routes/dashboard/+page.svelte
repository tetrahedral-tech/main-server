<script>
	import { enhance } from '$app/forms';
	import Graph from '$lib/components/Graph.svelte';
	import Sidebar from './Sidebar.svelte';

	export let data;

	let selectedAccount;
</script>

<main class="p-4 h-screen">
	<!-- reference: <form method="post" use:enhance>
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

	<code>{data.data}</code> -->
	<div class="w-full h-full bg-gray-950/90 flex gap-3 p-1">
		<Sidebar accounts={data.accounts} bind:selectedAccount />
		<div
			class="p-3 gap-3 border w-full rounded-md border-gray-500/20 flex flex-col justify-center items-center"
		>
			{#if selectedAccount}
				<span>{selectedAccount}</span>
			{/if}
			<img
				class="opacity-50"
				src="https://media.discordapp.net/attachments/1117102068851806309/1160867501140365342/scugclap.gif?ex=6536391c&is=6523c41c&hm=3e5ecbcb66eb983a8635205bf76df2873b960d91a0f88d4a6798df53997f1125&"
				alt="Graph"
			/>
		</div>
	</div>
</main>

<style>
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
