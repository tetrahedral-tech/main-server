<script>
	import Graph from '$lib/components/Graph.svelte';
	import { getContext } from 'svelte';
	import Sidebar from './Sidebar.svelte';

	const selectedAccount = getContext('selectedAccount');
</script>

<main>
	<section class="border-heavy flex h-full">
		<Sidebar />
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
					<Graph
						class="object-contain"
						token={getContext('user').token}
						path={`worth/${selectedAccount.id}`}
					/>
				{:else}
					<h1 class="subtext">please select an account</h1>
				{/if}
			</section>
		</div>
	</section>
</main>
