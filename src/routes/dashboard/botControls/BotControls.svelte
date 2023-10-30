<script>
	import {
		Pause,
		Play,
		Clock,
		Minus,
		AdjustmentsHorizontal,
		CommandLine,
		ArrowPath
	} from 'svelte-heros-v2';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';

	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');
</script>

<section
	class="{$selectedAccount ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-40'}
	bg-section-200 flex flex-wrap items-center justify-center transition-[opacity] duration-300"
>
	<form method="post" use:enhance>
		<button class="square !border-white/20 hover:!bg-white" title="Temporary Pause Bot"
			><Clock class="icon" /></button
		>
		<button class="square !border-green/20 hover:!bg-green" title="Resume Bot"
			><Play class="icon" />
		</button>
		<button class="square !border-yellow/20 hover:!bg-yellow" title="Pause Bot"
			><Pause class="icon" />
		</button>
		<button class="square !border-red/20 hover:!bg-red" title="Delete Bot">
			<Minus class="icon" />
		</button>
		<button class="square"><AdjustmentsHorizontal class="icon" /></button>
		{#if $user.admin}
			<button class="square"><CommandLine class="icon" /></button>
			<button class="square" formaction="/dashboard/botControls?/invokeAlgorithmCheck">
				<ArrowPath class="icon" title="Invoke Algorithm Check" />
			</button>
		{/if}
	</form>
</section>
