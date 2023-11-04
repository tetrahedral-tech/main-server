<script>
	import { getContext } from 'svelte';
	const selectedAccount = getContext('selectedAccount');
</script>

<section class="overflow-scroll">
	<button on:click={() => (location.href = `/dashboard/deposit#${$selectedAccount.address}`)}>
		/dashboard/deposit
	</button>
</section>
