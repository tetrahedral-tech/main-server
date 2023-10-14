<script>
	import Modal from '$lib/components/Modal.svelte';

	export let data;
	let open;
</script>

<main>
	{#if data}
		<Modal bind:open>
			{#if data.success}
				<div class="success">
					<span style="word-wrap: anywhere;">{data.token}</span>
					<br />
					<code>{JSON.stringify(data.account)}</code>
				</div>
			{:else}
				<div class="error">
					<span>{data.error}</span>
					{#if data.detailed}
						<br />
						<code>{data.detailed}</code>
					{/if}
				</div>
			{/if}
		</Modal>
	{/if}

	<button on:click={() => (open = !open)}>Toggle Modal</button>
</main>
