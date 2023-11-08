<script>
	import { ChevronUp } from 'svelte-heros-v2';

	export let placeholder;
	export let contents;
	export let defaults;
	export let open;
	export let selected = defaults ?? "";
	export const toggleOpen = () => (open = !open);

	let button;
	$: boundingRect = button?.getBoundingClientRect() ?? {
		top: 0,
		left: 0
	};
</script>

<button bind:this={button} on:click={toggleOpen} class="inline-flex w-fit gap-3">
	<span class="m-auto ml-0 select-none {selected != "" ? "opacity-0" : "opacity-40"}">{placeholder}</span>
	<span class="m-auto ml-0 absolute">{selected}</span>
	<ChevronUp class="transition-transform duration-500 {open ? 'rotate-180' : 'rotate-0'}" />
</button>

<section
	class="absolute z-10 mt-3 flex w-40 flex-col overflow-hidden transition-all duration-500 {!open
		? 'max-h-0 border-none pb-0 pt-0'
		: 'max-h-96'}"
	style="top: {boundingRect.y + boundingRect.height}px; left: {boundingRect.x}px;"
>
	<!-- {#if typeof contents === 'string'} -->
		{#each contents as content}
			<button
				on:click={() => (selected = content)}
				class="transition-all hover:scale-95 active:scale-90 {content === selected ? 'bg-accent text-black' : ''}"
			>
				{content}
			</button>
		{/each}
	<!-- {/if} -->
</section>
