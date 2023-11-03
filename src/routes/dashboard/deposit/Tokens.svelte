<script>
	import Web3 from 'web3';
	import { getContext } from 'svelte';
	import { tokens, defaultBaseToken } from '$lib/blockchain';
	import { browser } from '$app/environment';

	// eslint-disable-next-line max-len
	import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';

	const web3 = new Web3();
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

	export let accounts;
</script>

<section>
	<ul>
		<button class="border-yellow">Native Currency (Gas)</button><br />
		{#each Object.values(tokens).sort((a, b) => {
			if (a.equals(defaultBaseToken)) return -1;
			if (b.equals(defaultBaseToken)) return 1;
			return 0;
		}) as token}
			<button
				class={token.equals(defaultBaseToken) ? 'border-yellow' : 'border-none'}
				on:click={() => {
					const to = $selectedAccount.address;
					sendTransaction({
						to,
						from: $accounts[0],
						data: web3.eth.abi.encodeFunctionCall(erc20Abi, [to, 15])
					});
				}}
			>
				{token.name}
			</button>
			<br />
		{/each}
	</ul>
</section>
