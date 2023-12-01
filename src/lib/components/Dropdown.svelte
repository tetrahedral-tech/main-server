<script>
	import { createEventDispatcher } from 'svelte';
	import { ChevronUp } from 'svelte-heros-v2';

	export let placeholder;
	export let contents;

	export let open;
	export let selected;
	export const toggleOpen = () => (open = !open);

	let button;
	let dropdown;
	$: buttonBoundingRect = button?.getBoundingClientRect() ?? {
		top: 0,
		left: 0
	};
	$: dropdownBoundingRect = dropdown?.getBoundingClientRect() ?? {
		top: 0,
		left: 0
	};

	const dispatcher = createEventDispatcher();
	const handleChange = content => {
		selected = content;
		dispatcher('change', {
			option: content
		});
	};
</script>

<button bind:this={button} on:click|preventDefault={toggleOpen} class="relative inline-flex w-full gap-3">
	<!-- very fucking stuuupid!! -->
	<span class="m-auto ml-0 {selected !== undefined ? "opacity-0" : "opacity-25"}">
		{placeholder}
	</span>
	{#if selected !== undefined}
		<span class="absolute">{selected}</span>
	{/if}
	<ChevronUp class="transition-transform duration-500 ml-auto {open ? 'rotate-180' : 'rotate-0'}" />
</button>

<section
	bind:this={dropdown}
	class="absolute z-10 mt-3 flex w-44 flex-col overflow-hidden transition-all duration-500 {!open
		? 'max-h-0 border-none pb-0 pt-0'
		: 'max-h-96'}"
	style="top: {buttonBoundingRect.y + buttonBoundingRect.height}px;
	left: {buttonBoundingRect.x + (buttonBoundingRect.width - dropdownBoundingRect.width) / 2}px;"
>
	{#each contents as content}
		<button
			on:click|preventDefault={() => handleChange(content)}
			class="transition-all hover:scale-95 active:scale-90 {content === selected
				? 'bg-accent text-black'
				: ''}"
		>
			{content}
		</button>
	{/each}
</section>
