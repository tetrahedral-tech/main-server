<script>
	export let open = false;
	let dialog;

	$: {
		if (dialog && dialog.open !== open)
			if (open) dialog.showModal();
			// make sure the delay matches with the delay in the dialog styling
			else setTimeout(() => dialog.close(), 500);
	}

	const dialogClick = event => event.target === dialog && (open = false);
</script>

<dialog
	class="{open ? 'pointer-events-auto opacity-100' : 'opacity-0'}
	pointer-events-none bg-transparent text-white
	transition-opacity duration-[500ms]"
	bind:this={dialog}
	on:click={dialogClick}
	role="presentation"
>
	<section class="overflow-scroll">
		<slot />
	</section>
</dialog>
