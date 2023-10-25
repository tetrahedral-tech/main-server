<script>
	import Graph from '$lib/components/Graph.svelte';
	import { getContext } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');
</script>

<main>
	<section class="border-heavy flex h-full">
		<Sidebar />
		<div class="flex flex-grow flex-col gap-3">
			{#if $selectedAccount}
				{@const { address, id, balance } = $selectedAccount}
				<section>
					<h1 class="text-2xl">
						{address}
					</h1>

					<span class="subtext">
						Net Worth: {balance} USD
					</span>
				</section>
				<section class="flex h-full justify-center">
					<Avatar></Avatar>
					<Graph class="object-contain" token={$user.token} path="worth/{id}" />
				</section>
			{:else}
				<section>
					<h1 class="text-2xl">dashboard</h1>
					<span class="subtext">please select an account</span>
				</section>
				<section class="flex h-full items-center justify-center">
					<h1 class="subtext">please select an account</h1>
				</section>
			{/if}
		</div>
	</section>
</main>
