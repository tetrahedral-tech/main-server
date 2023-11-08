<script>
	import { ChevronUp } from 'svelte-heros-v2';

	export let contents, defaultSelected, open;
	export let selected = defaultSelected ?? contents[0];
	export const toggleOpen = () => (open = !open);

	let button;
	$: boundingRect = button?.getBoundingClientRect() ?? {
		top: 0,
		left: 0
	};

	$: console.log(boundingRect);
</script>

<button bind:this={button} on:click={toggleOpen} class="inline-flex w-32 gap-3">
	<span class="m-auto ml-0">{selected}</span>
	<ChevronUp class="transition-transform duration-500 {open ? 'rotate-180' : 'rotate-0'}" />
</button>

<section
	class="absolute z-10 mt-3 flex w-40 flex-col overflow-hidden transition-all duration-500 {open !=
	true
		? 'max-h-0 border-none pb-0 pt-0'
		: 'max-h-96'}"
	style="top: {boundingRect.y + boundingRect.height}px; left: {boundingRect.x}px;"
>
	{#each contents as content}
		<button
			on:click={() => (selected = content)}
			class="transition-all {content == selected ? 'bg-accent text-black' : ''}"
		>
			{content}
		</button>
	{/each}
</section>
