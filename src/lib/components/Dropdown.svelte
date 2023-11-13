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

<button bind:this={button} on:click={toggleOpen} class="inline-flex w-fit gap-3">
	{selected ?? placeholder}
	<!-- <span class="absolute m-auto ml-0">
	</span> -->
	<ChevronUp class="transition-transform duration-500 {open ? 'rotate-180' : 'rotate-0'}" />
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
			on:click={() => handleChange(content)}
			class="transition-all hover:scale-95 active:scale-90 {content === selected
				? 'bg-accent text-black'
				: ''}"
		>
			{content}
		</button>
	{/each}
</section>
