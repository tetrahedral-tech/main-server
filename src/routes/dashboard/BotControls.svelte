<script>
	import { Pause, Play, Clock, Minus, AdjustmentsHorizontal, CommandLine } from 'svelte-heros-v2';
	import { getContext } from 'svelte';

	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');
</script>

<section
	class="{$selectedAccount ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-40'}
	bg-section-200 flex flex-wrap items-center justify-center transition-[opacity] duration-300"
>
	<button class="square !border-white/20 hover:!bg-white" title="Temporary Pause Bot"
		><Clock class="icon" /></button
	>
	<button class="square !border-green-500/20 hover:!bg-green-500" title="Resume Bot"
		><Play class="icon" />
	</button>
	<button class="square !border-yellow-500/20 hover:!bg-yellow-500" title="Pause Bot"
		><Pause class="icon" />
	</button>
	<button class="square !border-rose-500/20 hover:!bg-rose-500" title="Delete Bot">
		<Minus class="icon" />
	</button>
	<button class="square"><AdjustmentsHorizontal class="icon" /></button>
	{#if $user.admin}
		<button class="square"><CommandLine class="icon" /></button>
	{/if}
</section>
