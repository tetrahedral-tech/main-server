<script>
	import { Pause, Play, Clock, Minus, AdjustmentsHorizontal } from 'svelte-heros-v2';
	export let account;
</script>

<section class={`
	${account ? "opacity-100 pointer-events-auto" : "opacity-20 pointer-events-none" }
`}>
	<button class="square hover:bg-white" title="Temporary Pause Bot"><Clock class="h-6 w-6" /></button>
	<button class="square hover:bg-green-500 border-green-500/20" title="Resume Bot"><Play class="h-6 w-6" /></button>
	<button class="square hover:bg-yellow-500 border-yellow-500/20" title="Pause Bot"><Pause class="h-6 w-6" /></button>
	<button class="square hover:bg-rose-500 border-rose-500/20" title="Delete Bot"><Minus class="h-6 w-6" /></button>
	<button class="square hover:bg-purple-500 border-purple-500/20"> <AdjustmentsHorizontal class="h-6 w-6" /></button>
</section>
