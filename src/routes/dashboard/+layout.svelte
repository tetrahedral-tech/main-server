<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

	const selectedAccount = writable();
	const accounts = writable();
	const user = writable();

	$: accounts.set(data.accounts);
	$: user.set(data.user);

	setContext('accounts', accounts);
	setContext('selectedAccount', selectedAccount);
	setContext('user', user);
</script>

<slot />
