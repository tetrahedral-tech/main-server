<script>
	import { PUBLIC_ALGORITHM_SERVER_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	export let token;
	export let path;
	let graph;

	onMount(() => {
		fetch(`${PUBLIC_ALGORITHM_SERVER_BASE_URL}/${path}`, { headers: { Authorization: token } })
			.then(response => response.blob())
			.then(data => (graph.src = window.URL.createObjectURL(data)))
			.catch(() => (graph.alt = 'Failed to load graph.'));
	});
</script>

<img {...$$restProps} alt="Graph" bind:this={graph} />
