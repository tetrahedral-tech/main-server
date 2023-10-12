<script>
	import { PUBLIC_ALGORITHM_SERVER_BASE_URL } from '$env/static/public';

	export let token;
	export let path;
	let graph;

	const loadGraph = () => {
		fetch(`${PUBLIC_ALGORITHM_SERVER_BASE_URL}/${path}`, { headers: { Authorization: token } })
			.then(response => response.blob())
			.then(data => (graph.src = window.URL.createObjectURL(data)))
			.catch(() => (graph.alt = 'Failed to load graph.'));
	};
</script>

{#key (token, path)}
	{loadGraph() || ''}
	<img {...$$restProps} alt="Graph" bind:this={graph} />
{/key}
