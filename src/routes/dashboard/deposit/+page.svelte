<script>
	import { getContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { PUBLIC_CHAINID } from '$env/static/public';
	import Tokens from './Tokens.svelte';

	const { ethereum } = browser ? window : {};

	const requestConnection = async () =>
		ethereum?.request({
			method: 'eth_requestAccounts',
			params: []
		}) ?? [];

	const getAccounts = async () =>
		ethereum?.request({
			method: 'eth_accounts',
			params: []
		}) ?? [];

	const switchChain = async newChainId =>
		ethereum?.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: `0x${newChainId.toString(16)}` }]
		});

	const getChain = async () =>
		ethereum?.request({
			method: 'eth_chainId',
			params: []
		}) || '0x1';

	const chainId = Number(PUBLIC_CHAINID);
	let userChainId = 1;
	getChain().then(newChainId => ethereum?.emit('chainChanged', newChainId));
	ethereum?.on('chainChanged', newChainId => (userChainId = Number(newChainId)));

	const selectedAccount = getContext('selectedAccount');
	const accounts = writable([]);

	const refreshAccounts = async () => ($accounts = await getAccounts());
	onMount(refreshAccounts);
</script>

<main>
	{#if userChainId !== chainId}
		<section class="border-red">
			<h2>WARNING: You are not on a supported chain!</h2>
			<button on:click={() => switchChain(chainId)}>Switch to Chain {chainId}</button>
		</section>
		<br />
	{:else if !$selectedAccount}
		<section class="border-red">
			<h2>WARNING: You do not currently have a selected account!</h2>
			<button on:click={() => (location.href = '/dashboard')}>/dashboard</button>
		</section>
		<br />
	{:else}
		<h2>Supported Tokens:</h2>
		<Tokens {accounts} />
		<br />

		<h2>Selected Account:</h2>
		<p>{$selectedAccount.address}</p>
		<br />
	{/if}

	{#if $accounts.length < 1}
		<button on:click={() => requestConnection().then(refreshAccounts)}>Connect Metamask</button>
	{:else}
		<h2>Connected Wallets:</h2>
		<ul>
			{#each $accounts as account}
				<p>{account}</p>
			{/each}
		</ul>
	{/if}
</main>
