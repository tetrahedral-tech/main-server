<script>
	import Graph from '$lib/components/Graph.svelte';
	import Sidebar from './Sidebar.svelte';

	export let data;

	let selectedAccount;
</script>

<main class="p-4 h-screen">
	<section class="w-full h-full flex border-gray-500/60">
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
			<div class="flex gap-3 h-full">
				<section class="w-3/4 flex">
					{#if selectedAccount}
						<Graph class="object-contain" token={data.token} path={`worth/${selectedAccount.id}`} />
					{:else}
						<h1 class="subtext">please select an account</h1>
					{/if}
				</section>
				<section class="w-1/4">
					<h1 class="text-xl">bot controls</h1>
				</section>
			</div>
		</div>
	</section>
</main>
