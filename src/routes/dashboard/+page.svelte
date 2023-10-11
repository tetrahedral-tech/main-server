<script>
	import Graph from '$lib/components/Graph.svelte';
	import Sidebar from './Sidebar.svelte';

	export let data;

	let selectedAccount;
</script>

<main class="p-4 h-screen">
	<section class="h-full flex border-gray-500/60">
		<Sidebar accounts={data.accounts} bind:selectedAccount />
		<div class="flex flex-col flex-grow gap-3">
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
			<section class="h-full flex">
				{#if selectedAccount}
					<Graph class="object-contain" token={data.token} path={`worth/${selectedAccount.id}`} />
				{:else}
					<h1 class="subtext">please select an account</h1>
				{/if}
			</section>
		</div>
	</section>
</main>
