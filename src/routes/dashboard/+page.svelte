<script>
	import Graph from '$lib/components/Graph.svelte';
	import Sidebar from './Sidebar.svelte';

	export let data;

	let selectedAccount;
</script>

<main class="h-screen p-4">
	<section class="border-heavy flex h-full">
		<Sidebar accounts={data.accounts} bind:selectedAccount />
		<div class="flex flex-grow flex-col gap-3">
			<section>
				<h1 class="text-2xl">
					{selectedAccount ? selectedAccount.address : 'dashboard'}
				</h1>

				<span class="subtext">
					{selectedAccount
						? `Net Worth: ${selectedAccount.balance} USD`
						: 'please select an account'}
				</span>
			</section>
			<section class="flex h-full justify-center">
				{#if selectedAccount}
					<Graph class="object-contain" token={data.token} path={`worth/${selectedAccount.id}`} />
				{:else}
					<h1 class="subtext">please select an account</h1>
				{/if}
			</section>
		</div>
	</section>
</main>
