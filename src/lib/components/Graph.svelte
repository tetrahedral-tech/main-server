<script>
	import { PUBLIC_ALGORITHM_SERVER_URI } from '$env/static/public';

	export let token;
	export let path;
	let graphElement;

	const loadGraph = () => {
		fetch(`${PUBLIC_ALGORITHM_SERVER_URI}/${path}`, { headers: { Authorization: token } })
			.then(response => response.blob())
			.then(data => (graphElement.src = window.URL.createObjectURL(data)))
			.catch(() => (graphElement.alt = 'Failed to load graph.'));
	};
</script>

{#key (token, path)}
	{loadGraph() || ''}
	<img {...$$restProps} alt="Graph" bind:this={graphElement} />
{/key}
