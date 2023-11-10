<script>
	import { getContext } from 'svelte';

	const selectedAccount = getContext('selectedAccount');
</script>

{#if $selectedAccount}
	<input type="text" name="id" value={$selectedAccount.id} />
	<input type="text" name="status" value="paused" />
{/if}
