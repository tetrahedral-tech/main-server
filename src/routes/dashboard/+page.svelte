<script>
	const getAccounts = async () => {
		const response = await fetch('/dashboard');
		return response.json();
	};
</script>

<main>
	{#await getAccounts()}
		<h3>Loading...</h3>
	{:then accounts}
		{#each accounts as account}
			<code>{account.publicKey}</code><br />
			{#if account.privateKey}
				<code class="private"><span>{account.privateKey}</span></code><br />
			{/if}
			<span class="balance">{account.balance} ETH</span><br />
		{/each}
		<code>{JSON.stringify(accounts)}</code>
	{/await}
</main>

<style>
	.balance {
		color: #4e4e4e;
		font-size: 16px;
		font-style: italic;
	}

	.private {
		user-select: none;
		color: #3e3e3e;
		background-color: #3e3e3e;
		border-radius: 2px;
		transition: color 0.2s, background-color 0.2s;
	}

	.private:hover {
		user-select: initial;
		color: initial;
		background-color: initial;
	}
</style>
