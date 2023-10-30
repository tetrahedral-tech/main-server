<script>
	import BotControls from './botControls/BotControls.svelte';
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';

	let showMenu = false;
	let searchValue = '';

	const statusTypeMap = {
		running: 'border-l-green',
		paused: 'border-l-red',
		tempPaused: 'border-l-yellow'
	};

	const accounts = getContext('accounts');
	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');
</script>

<div
	class="flex w-1/5 flex-col {showMenu === true ? 'gap-3' : 'gap-0'} transition-all duration-1000 w-96"
	style="transition-timing-function: cubic-bezier(0.83, 0.0, 0.17, 1.0)"
>
	<section
		class={`pl-5 pr-5
		${showMenu === true ? 'max-h-96 border p-5' : 'max-h-0 border-none p-0'}
		bg-section-200 overflow-hidden transition-all duration-1000`}
		style="transition-timing-function: cubic-bezier(0.83, 0.0, 0.17, 1.0)"
	>
		<h1 class="text-2xl">Add a bot</h1>
		<form method="post" class="flex flex-col gap-2" use:enhance>
			<input class="hidden" type="text" name="id" placeholder="ID" />
			<input type="number" name="strengthToUSD" placeholder="1.0 Strength -> USD" />
			<input type="text" name="algorithm" placeholder="Algorithm" />
			{#if $user.admin}
				<input type="text" name="privateKey" placeholder="Private Key Override" />
			{/if}
			<div class="flex w-full gap-2">
				<button
					class="border-green/40 hover:bg-green flex-grow transition-all hover:text-black"
					formaction="/bots?/create"
				>
					Create Bot
				</button>

				<button
					on:click|preventDefault={() => (showMenu = false)}
					class="border-red/40 hover:bg-red flex-grow transition-all hover:text-black"
				>
					Cancel
				</button>
			</div>
		</form>
	</section>

	<div class="flex flex-grow flex-col gap-3">
		<section class="bg-section-200 relative flex h-full flex-col">
			<div class="flex">
				<input type="text" class="w-full" placeholder="search" bind:value={searchValue} />
				<button on:click={() => (showMenu = !showMenu)} class="square"> + </button>
			</div>
			{#each $accounts.filter(({ address }) => address.includes(searchValue)) as account}
				{@const { address, balance, privateKey, status } = account}
				<button
					on:click={() => ($selectedAccount = account)}
					class="{address === $selectedAccount?.address ? 'border-selected' : ''}
					{statusTypeMap[status.name]}
					w-full whitespace-nowrap border-l-4 transition-colors [text-align:initial]"
				>
					<h1 class="truncate text-2xl">{address}</h1>
					<p class="balance subtext">
						<span class="hidden lg:inline">Net Worth:</span>
						{balance} USD
					</p>
					{#if privateKey}
						<p class="private truncate">{privateKey}</p>
					{/if}
				</button>
			{/each}
		</section>
	</div>
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
	.balance {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: '..USD';
	}
</style>
