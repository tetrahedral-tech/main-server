<script>
    import Modal from "./Modal.svelte";
    import Avatar from "./Avatar.svelte";

    import { getContext } from 'svelte';

    import { ExclamationTriangle } from "svelte-heros-v2";

    const user = getContext('user');
    let open = false;
</script>

<button on:click={() => (open = !open)} class="
    p-0 overflow-hidden ml-auto h-full 
    hover:scale-90 hover:active:scale-[80%] 
    max-h-20 transition-all duration-500">

    <Avatar draggable=false class="
    h-20 w-20 block aspect-square 
    hover:scale-110 transition-all 
    duration-500"/>

</button>

<Modal bind:open>
    <div class="flex h-[70vh] flex-grow flex-row w-[50vw] overflow-hidden border rounded-md border-gray-600/50">
        <div class="sidebar flex-grow-0 p-3 flex flex-col gap-2 bg-gray-900/20 border border-gray-600/30">

            <div class="flex items-center">
                <Avatar draggable="false" class="object-fit rounded-md h-20 w-20 transition-all duration-500"/>
                <div class="m-3 ml-4">
                    <h1 class="text-xl max-w-[13ch] whitespace-nowrap text-ellipsis overflow-hidden">
                        {$user.identity.name}</h1>
                    <a href="/identity" class="subtext font-sans font-medium hover:font-bold">switch accounts</a>
                </div>
            </div>

            <button class="flex items-center">
                <ExclamationTriangle size=40 />
                <h1 class="text-xl flex-grow">hello world!</h1>
            </button>
        </div>
        <div class="main-contents flex-grow p-3 bg-gray-950/40">
            placeholder, please replace
        </div>
    </div>
</Modal>