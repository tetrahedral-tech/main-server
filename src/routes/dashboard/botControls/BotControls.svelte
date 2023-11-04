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
	import Modal from '$lib/components/Modal.svelte';

	import BotOptions from './buttons/BotOptions.svelte';

	const buttons = [
		{
			tooltip: 'Temporary Pause Bot',
			classes: '!border-white/20 hover:!bg-white',
			icon: Clock,
			menu: null,
			admin: false
		},
		{
			tooltip: 'Resume Bot',
			classes: '!border-green/20 hover:!bg-green',
			icon: Play,
			menu: null,
			admin: false
		},
		{
			tooltip: 'Pause Bot',
			classes: '!border-yellow/20 hover:!bg-yellow',
			icon: Pause,
			menu: null,
			admin: false
		},
		{
			tooltip: 'Delete Bot',
			classes: '!border-red/20 hover:!bg-red',
			icon: Minus,
			menu: null,
			admin: false
		},
		{
			tooltip: 'Bot Options',
			icon: AdjustmentsHorizontal,
			menu: BotOptions,
			admin: false
		},
		{
			tooltip: 'Admin Settings',
			icon: CommandLine,
			formaction: '/dashboard/botControls?/invokeAlgorithmCheck',
			admin: true
		},
		{
			tooltip: 'Invoke Algorithm Check',
			icon: ArrowPath,
			menu: null,
			admin: true
		}
	];

	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');
	const dialogs = [];
</script>

<section
	class="{$selectedAccount ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-40'}
	bg-section-200 flex flex-wrap items-center justify-center transition-[opacity] duration-300"
>
	{#each buttons as data, i}
		{#if (data.admin && $user.admin) || !data.admin}
			<button
				class="square {data.classes ?? ''}"
				title={data.title}
				formaction={data.formaction}
				on:click={() => data.menu && (dialogs[i] = true)}
			>
				<svelte:component this={data.icon} class="icon" />
				{#if data.menu}
					<Modal bind:open={dialogs[i]}>
						<svelte:component this={data.menu} />
					</Modal>
				{/if}
			</button>
		{/if}
	{/each}
</section>
