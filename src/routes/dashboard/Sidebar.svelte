<script>
    export let data;
</script>
<main>
    <div class="w-[350px] border h-full bg-gray-950/30 border-gray-500/20 rounded-md p-3 flex flex-col gap-2">
        <div class="flex gap-2">
            <input type="text" class="w-full h-16 border bg-gray-950/30 border-gray-500/40 rounded-md p-3 flex flex-col gap-2" placeholder="search">
            <button formaction="/bots?/create" class="h-16 w-[70px] text-2xl hover:bg-green-500 hover:text-black transition-all">+</button>
        </div>
        {#each data.accounts as { address, balance }}
            <div class="border w-full bg-gray-950/90 border-gray-500/40 p-3 overflow-hidden whitespace-nowrap border-l-green-500 border-l-4">
                <h1 class="text-2xl text-ellipsis overflow-hidden whitespace-nowrap">{address}</h1>
                <span class="balance">Net Worth: {balance} USD</span><br />
            </div>	
        {/each}
    </div>
</main>

<style>
    .balance {
		color: #4e4e4e;
		font-size: 16px;
		font-style: italic;
	}
    input::placeholder {
        color: #4e4e4e;
        font-style: italic;
    }
</style>