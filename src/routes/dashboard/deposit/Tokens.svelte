<script>
	import { Interface } from 'ethers';
	import { getContext } from 'svelte';
	import { tokens, fromReadableAmount } from '$lib/blockchain';
	import { browser } from '$app/environment';

	// eslint-disable-next-line max-len
	import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';

	const { ethereum } = browser ? window : {};

	const sendTransaction = async ({ from, to, data, value }) =>
		ethereum?.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from,
					to,
					data,
					value
				}
			]
		}) || '0x0';

	const selectedAccount = getContext('selectedAccount');
	const erc20Interface = new Interface(erc20Abi);

	export let accounts;
</script>

<section>
	<ul>
		<button
			class="border-yellow"
			on:click={() =>
				sendTransaction({
					to: $selectedAccount.address,
					from: $accounts[0],
					value: fromReadableAmount(0.01, tokens.weth.decimals).toString(16)
				})}
		>
			Native Currency (Gas)
		</button><br />
		<!-- @TODO sort tokens based on if bot is using coin in its pair -->
		{#each Object.values(tokens) as token}
			<!-- eslint-disable no-constant-condition -->
			<!-- @TODO highlight border if bot is using coin in its pair -->
			<button
				class={false ? 'border-yellow' : 'border-none'}
				on:click={() =>
					sendTransaction({
						to: token.address,
						from: $accounts[0],
						data: erc20Interface.encodeFunctionData('transfer', [
							$selectedAccount.address,
							fromReadableAmount(20, token.decimals)
						])
					})}
			>
				{token.name}
			</button>
			<!-- eslint-enable no-constant-condition -->
			<br />
		{/each}
	</ul>
</section>
