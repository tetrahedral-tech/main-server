<script>
	import { Pause, Play, Clock, Minus, AdjustmentsHorizontal } from 'svelte-heros-v2';
	export let selectedAccount;
</script>

<section
	class="
	{selectedAccount ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-20'}
	bg-section-200 flex items-center justify-center transition-[opacity] duration-300
"
>
	<button class="square hover:!bg-white" title="Temporary Pause Bot"><Clock class="icon" /></button>
	<button class="square border-green-500/20 hover:!bg-green-500" title="Resume Bot"
		><Play class="icon" />
	</button>
	<button class="square border-yellow-500/20 hover:!bg-yellow-500" title="Pause Bot"
		><Pause class="icon" />
	</button>
	<button class="square border-rose-500/20 hover:!bg-rose-500" title="Delete Bot">
		<Minus class="icon" />
	</button>
	<button class=" border-accent/20 square"><AdjustmentsHorizontal class="icon" /></button>
</section>
