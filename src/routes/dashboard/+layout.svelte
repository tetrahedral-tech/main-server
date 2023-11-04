<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	export let data;

	const selectedAccount = writable();
	const accounts = writable();
	const user = writable();

	$: accounts.set(data.accounts);
	$: user.set(data.user);
	$: selectedAccount.set(
		$accounts.find(account => account.address === $page.url.hash.substring(1))
	);

	setContext('accounts', accounts);
	setContext('selectedAccount', selectedAccount);
	setContext('user', user);
</script>

<slot />
