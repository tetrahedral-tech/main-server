<script>
	export let accounts;
	export let selectedAccount;

	const statusMap = {
		running: 'green',
		paused: 'red',
		tempPaused: 'yellow'
	};
</script>

<section>
	<div class="w-[350px] border h-full border-gray-500/20 rounded-md p-3 flex flex-col gap-2">
		<div class="flex gap-2">
			<input
				type="text"
				class="w-full border bg-gray-950 border-gray-500/40 rounded-md p-3 flex flex-col gap-2"
				placeholder="search"
			/>
			<button
				formaction="/bots?/create"
				class="w-1/4 text-2xl hover:bg-green-500 hover:text-black transition-all">+</button
			>
		</div>
		{#each accounts as { address, balance, status }}
			<button
				on:click={() => (selectedAccount = address)}
				class={`${
					address === selectedAccount ? 'border-yellow-500/80' : ''
				} border w-full p-3 overflow-hidden whitespace-nowrap border-l-${
					statusMap[status]
				}-500 border-l-4`}
			>
				<h1 class="text-2xl text-ellipsis overflow-hidden whitespace-nowrap">{address}</h1>
				<span class="balance">Net Worth: {balance.toFixed(3)} USD</span><br />
			</button>
		{/each}
	</div>
</section>

<style>
	.balance {
		color: #4e4e4e;
		font-size: 16px;
		font-style: italic;
	}

	input::placeholder {
		color: #4e4e4e;
		font-style: italic;
	}
</style>
