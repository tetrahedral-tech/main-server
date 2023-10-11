<script>
	import { enhance } from '$app/forms';

	export let accounts;
	export let selectedAccount;

	let showMenu = false;

	const statusMap = {
		running: 'border-l-green-500',
		paused: 'border-l-red-500',
		tempPaused: 'border-l-yellow-500'
	};
</script>

<div
	class="w-1/5 flex flex-col {showMenu === true ? 'gap-3' : 'gap-0'} transition-all duration-1000"
	style="transition-timing-function: cubic-bezier(0.83, 0.0, 0.17, 1.0)"
>
	<section
		class={`pl-5 pr-5
		${showMenu === true ? 'p-5 max-h-96 border' : 'p-0 max-h-0 border-none'}
		bg-gray-950/40 overflow-hidden transition-all duration-1000`}
		style="transition-timing-function: cubic-bezier(0.83, 0.0, 0.17, 1.0)"
	>
		<h1 class="text-2xl">Add a bot</h1>
		<form method="post" class="flex flex-col gap-2" use:enhance>
			<input class="hidden" type="text" name="id" placeholder="ID" />
			<input type="number" name="strengthToUSD" placeholder="1.0 Strength -> USD" />
			<input type="text" name="algorithm" placeholder="Algorithm" />
			<div class="flex w-full gap-2">
				<button
					class="flex-grow border-green-700 bg-gray-950/70 hover:bg-green-500 hover:text-black transition-all"
					formaction="/bots?/create"
				>
					Create Bot
				</button>

				<button
					on:click|preventDefault={() => (showMenu = false)}
					class="flex-grow border-red-800 bg-gray-950/70 hover:bg-red-500 hover:text-black transition-all"
				>
					Cancel
				</button>
			</div>
		</form>
	</section>

	<section class="bg-gray-950/40 flex flex-col relative">
		<div class="flex">
			<input type="text" class="w-full" placeholder="search" />
			<button
				on:click={() => (showMenu = !showMenu)}
				class="h-full leading-[0] aspect-square text-2xl hover:bg-green-500 hover:text-black transition-colors"
			>
				+
			</button>
		</div>
		{#each accounts as { address, balance, status, id, privateKey }}
			<button
				on:click={() => (selectedAccount = { address, balance, status, id })}
				class="{address === selectedAccount?.address
					? 'border-gray-400/80'
					: 'hover:border-gray-500/80'} {statusMap[status]}
				border-l-4 transition-colors w-full p-3 whitespace-nowrap [text-align:initial]"
			>
				<h1 class="text-2xl truncate">{address}</h1>
				<span class="balance subtext">
					<span class="hidden lg:inline">Net Worth:</span>
					{balance} USD
				</span>
				{#if privateKey}
					<p class="private truncate">{privateKey}</p>
				{/if}
			</button>
		{/each}
	</section>
</div>

<style>
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
