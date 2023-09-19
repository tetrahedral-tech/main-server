<script>
	export let data;
</script>

<main>
	{#if data}
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
	{/if}
</main>

<style>
	.success {
		color: plum;
	}

	.error {
		color: lightcoral;
	}

	code {
		white-space: pre-line;
	}
</style>
