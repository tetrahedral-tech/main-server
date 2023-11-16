<script>
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { ChartBar } from 'svelte-heros-v2';

	const selectedAccount = getContext('selectedAccount');
</script>

<section class="overflow-hidden">
	{#if $selectedAccount}
		<form method="post" use:enhance>
			<input class="hidden" type="text" name="id" bind:value={$selectedAccount.id} />
			<input class="hidden" type="text" name="clearWorth" value={true} />
			<button class="square" title="Clear Worths" formaction="/bots?/update">
				<ChartBar class="icon" />
			</button>
		</form>
	{/if}
	<button on:click={() => (location.href = `/dashboard/deposit#${$selectedAccount.address}`)}>
		/dashboard/deposit
	</button>
</section>
