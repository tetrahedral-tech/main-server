<script>
	import { enhance } from '$app/forms';
	import Blob from '../../lib/blob.svelte';
	import Graph from './Graph.svelte';

	import Sidebar from './Sidebar.svelte';
	export let data;
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
	<Blob/>
	<div class="border w-full h-full bg-gray-950/90 border-gray-500 rounded-md flex p-3 gap-3">
		<Sidebar data={data}/>
		<div class="border w-full h-full bg-gray-950/20 border-gray-500/20 rounded-md flex p-3 focus-within:border-gray-500/80 flex-col gap-3 justify-center items-center">
			<h1 class="text-4xl opacity-50">graph placeholder</h1>
			<img class="opacity-25" src="https://media.discordapp.net/attachments/1117102068851806309/1160867501140365342/scugclap.gif?ex=6536391c&is=6523c41c&hm=3e5ecbcb66eb983a8635205bf76df2873b960d91a0f88d4a6798df53997f1125&" alt="fizz says hi">
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
