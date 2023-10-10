<script>
	import { PUBLIC_ALGORITHM_SERVER_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	export let token, path;
	let graphElement;

	onMount(() => {
		fetch(`${PUBLIC_ALGORITHM_SERVER_BASE_URL}/${path}`, { headers: { Authorization: token } })
			.then(response => response.blob())
			.then(data => (graphElement.src = window.URL.createObjectURL(data)))
			.catch(err => (graphElement.alt = "Failed to load graph."));
	});
</script>

<img alt="Graph" bind:this={graphElement} />
