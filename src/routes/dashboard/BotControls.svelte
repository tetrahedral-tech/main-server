<script>
	import { Pause, Play, Clock, Minus, AdjustmentsHorizontal } from 'svelte-heros-v2';
</script>

<section>
	<button class="square" title="Pause Bot"><Pause class="h-6 w-6" /></button>
	<button class="square" title="Resume Bot"><Play class="h-6 w-6" /></button>
	<button class="square" title="Temporary Pause Bot"><Clock class="h-6 w-6" /></button>
	<button class="square" title="Delete Bot"><Minus class="h-6 w-6" /></button>
	<button class="square"><AdjustmentsHorizontal class="h-6 w-6" /></button>
</section>
