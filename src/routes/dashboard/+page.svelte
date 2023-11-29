<script>
	import { getContext } from 'svelte';

	import Graph from '$lib/components/Graph.svelte';
	import Sidebar from './Sidebar.svelte';
	import BotControls from './botControls/BotControls.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';

	let open = true;
	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');

</script>

<main class="flex items-center justify-center p-6">
	<section class="border-heavy flex h-full w-5/6">
		<Sidebar />
		<div class="flex flex-grow flex-col gap-3">
			{#if $selectedAccount}
				{@const { address, id, balance } = $selectedAccount}
				<section class="flex items-center"> 
					<div class="">
						<h1 class="text-2xl">
							{address}
						</h1>

						<span class="subtext">
							{id}<br />
							Net Worth: {balance} USD
						</span>
					</div>
					<UserMenu />
				</section>
				<section class="flex h-full justify-center">
					<Graph class="object-contain" token={$user.token} path="worth/{id}" />
				</section>
			{:else}
				<section class="flex items-center">
					<div>
						<h1 class="text-2xl">dashboard</h1>
						<span class="subtext">please select an account</span>
					</div>
					<UserMenu />
				</section>
				<section class="flex h-full items-center justify-center">
					<h1 class="subtext">please select an account</h1>
				</section>
			{/if}
			<BotControls />
		</div>
	</section>
</main>
