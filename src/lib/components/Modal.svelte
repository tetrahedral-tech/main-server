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

	const quitModal = e => {
		if (open && e.key === "Escape") {
			open = false;
			dialog.close();
		}
	}
</script>

<div class="w-screen h-screen absolute z-10 pointer-events-none top-0 left-0 transition-all duration-500
{open ? 'bg-gray-950/50 backdrop-blur-md' : 'bg-transparent'}"></div>

<dialog
	class="{open ? 'pointer-events-auto cursor-auto opacity-100 scale-100' : 'opacity-0 scale-75'}
	pointer-events-none z-50 
	bg-transparent text-white transition-all duration-[500ms] backdrop-blur-md backdrop:bg-transparent"
	bind:this={dialog}
	on:click={dialogClick}
	on:keydown|preventDefault={quitModal}
	role="presentation"
>	
	<slot/>
</dialog>