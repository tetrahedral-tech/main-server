<script>
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

	<code>{data.data}</code> -->
	<div class="w-full h-full bg-gray-950/40 flex gap-3 rounded-md p-3 border border-gray-500/60">
		<Sidebar accounts={data.accounts} bind:selectedAccount />
		<div class="flex flex-col flex-grow gap-3">
			<div
				class="p-4 border w-full rounded-md bg-gray-950/60 border-gray-500/20 flex flex-col h-min transition-all">

				<h1 class="text-2xl">
					{selectedAccount ? selectedAccount[0] : "dashboard"}
				</h1>

				<span class="opacity-50">
					{selectedAccount ? `Net Worth: ${selectedAccount[1]} USD` : "please select an account"}
				</span>
			</div>
			<div class="flex gap-3 h-full">
				<div class="p-4 border w-full rounded-md bg-gray-950/60 border-gray-500/20 flex flex-col transition-all justify-center items-center">
					{#if selectedAccount}
						<Graph token={data.token} path={`worth/rsi`}/>
					{:else}
						<h1 class="opacity-50">please select an account!</h1>
					{/if}
				</div>
				<div class="p-4 border w-[400px] rounded-md bg-gray-950/60 border-gray-500/20 flex flex-col transition-all">
					<h1 class="text-xl">bot controls</h1>
				</div>
			</div>
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
