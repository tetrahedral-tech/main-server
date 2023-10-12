<script>
	export let open = false;
	let dialog;

	$: {
		if (dialog && dialog.open !== open)
			if (open) dialog.showModal();
			else dialog.close();
	}
</script>

<dialog
	class="{open ? 'pointer-events-auto' : ''} pointer-events-none
	fixed left-0 top-0 m-0 grid h-full w-full
	items-center justify-center bg-transparent"
	bind:this={dialog}
>
	<section
		class="{open ? 'opacity-100' : 'opacity-0'}
		overflow-scroll text-white transition-opacity lg:w-2/5"
	>
		<slot />
	</section>
	<form class="-z-1 col-start-1 col-end-1 grid self-stretch justify-self-stretch" method="dialog">
		<button class="cursor-pointer">close</button>
	</form>
</dialog>
