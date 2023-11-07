<!-- hot sloppy code please do a cleanup pr luv u <3 -->
<script>
    export let placeholder, contents, defaults;
    
    let open;
    let selected = "";
    if (defaults) { selected = defaults; }

    import {
		ChevronDoubleUp
	} from 'svelte-heros-v2';
</script>

<div class="p-2 w-full gap-3 rounded-md border border-light bg-section-300 flex relative">
    <h1 class="m-auto ml-2 {selected != "" ? "opacity-100" : "opacity-25 select-none"}">
        {selected != "" ? selected : placeholder}
    </h1>
    <button on:click={() => (open = !open)} ><ChevronDoubleUp class="{open == true ? "rotate-180" : "rotate-0"} transition-all duration-500"/></button>
    <div class="absolute flex flex-col flex-grow w-full left-0 p-4 gap-2 bg-section-300 top-20 rounded-md overflow-hidden transition-all duration-500 {open != true ? "max-h-0 pt-0 pb-0" : "max-h-96"}">
        {#each contents as content}
            <button on:click={() => {selected = content; console.log(selected)}} class="transition-all {content == selected ? "bg-accent text-black" : ""}">
                {content}
            </button>
        {/each}
    </div>
</div>