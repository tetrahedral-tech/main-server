<script>
	import { enhance } from '$app/forms';

	export let accounts;
	export let selectedAccount;

	let showMenu = false;

	const statusMap = {
		running: 'green',
		paused: 'red',
		tempPaused: 'yellow'
	};
</script>

<section
	class={`flex flex-col ${showMenu === true ? 'gap-3' : 'gap-0'}`}
	style="transition:all 1000ms cubic-bezier(0.83, 0, 0.17, 1);"
>
	<div
		class={`w-full pl-5 pr-5
		${showMenu === true ? 'p-5 max-h-96 border' : 'p-0 max-h-0'}
		rounded-md border-gray-500/30 bg-gray-950/40 bottom-0 h-[450px] left-0 backdrop-blur-xl overflow-hidden`}
		style="transition:all 1000ms cubic-bezier(0.83, 0, 0.17, 1);"
	>
		<h1 class="text-2xl">Add a bot</h1>
		<form method="post" class="m-0 w-full flex flex-col gap-2" use:enhance>
			<input
				class="w-full p-2 rounded-md border border-gray-500/30 bg-gray-950/40"
				type="text"
				name="id"
				placeholder="ID"
			/>
			<input
				class="w-full p-2 rounded-md border border-gray-500/30 bg-gray-950/40"
				type="number"
				name="strengthToUSD"
				placeholder="1.0 Strength -> USD"
			/>
			<input
				class="w-full p-2 rounded-md border border-gray-500/30 bg-gray-950/40"
				type="text"
				name="algorithm"
				placeholder="Algorithm"
			/>
			<div class="flex w-full gap-2">
				<button
					class="flex-grow border-green-700 bg-gray-950/70 hover:bg-green-500 hover:text-black transition-all"
					formaction="/bots?/create"
				>
					Create Bot</button
				>

				<button
					on:click|preventDefault={() => {
						showMenu = false;
					}}
					class="flex-grow border-red-800 bg-gray-950/70 hover:bg-red-500 hover:text-black transition-all"
				>
					Cancel</button
				>
			</div>
		</form>
	</div>

	<div
		class="w-[350px] border h-fulWl border-gray-500/40 bg-gray-500/20 rounded-md p-3 flex flex-col gap-2 relative"
	>
		<div class="flex gap-2">
			<input
				type="text"
				class="w-full border bg-gray-950/70 border-gray-500/40 rounded-md p-3 flex flex-col gap-2"
				placeholder="search"
			/>
			<button
				on:click={() => {
					showMenu = true;
				}}
				class="w-1/4 text-2xl border-green-800 bg-gray-950/70 hover:bg-green-500 hover:text-black transition-all"
				>+</button
			>
		</div>
		{#each accounts as { address, balance, status, id, privateKey }}
			<button
				on:click={() => (selectedAccount = { address, balance, status, id })}
				class={`${
					address === selectedAccount ? 'border-yellow-500/80' : 'hover:border-gray-500/80' // this doesn't work properly oops
				} border-l-${
					statusMap[status]
				}-500 border-l-4 bg-gray-950/70 transition-all border w-full p-3 overflow-hidden whitespace-nowrap [text-align:initial]`}
			>
				<h1 class="text-2xl truncate">{address}</h1>
				<span class="balance opacity-50">Net Worth: {balance} USD</span>
				{#if privateKey}
					<p class="private truncate">{privateKey}</p>
				{/if}
			</button>
		{/each}
	</div>
</section>

<style>
	.balance {
		color: white;
	}

	input::placeholder {
		color: #4e4e4e;
		font-style: italic;
	}

	.private {
		color: #00000000;
		user-select: none;
		transition:
			color 0.2s,
			background-color 0.2s;
	}

	.private:hover {
		user-select: initial;
		color: #4e4e4e;
	}
</style>
