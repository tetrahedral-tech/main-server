<script>
	import { Pause, Play, Clock, Minus, AdjustmentsHorizontal } from 'svelte-heros-v2';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';

	import BotOptions from './menus/BotOptions.svelte';
	import ResumeBot from './formData/ResumeBot.svelte';
	import PauseBot from './formData/PauseBot.svelte';
	import DeleteBot from './menus/DeleteBot.svelte';

	const selectedAccount = getContext('selectedAccount');
	const user = getContext('user');

	const buttons = [
		{
			title: 'Temporary Pause Bot',
			classes: '!border-white/20 hover:!bg-white',
			icon: Clock
		},
		{
			title: 'Resume Bot',
			classes: '!border-green/20 hover:!bg-green',
			icon: Play,
			formaction: '/bots?/update',
			formdata: ResumeBot
		},
		{
			title: 'Pause Bot',
			classes: '!border-yellow/20 hover:!bg-yellow',
			icon: Pause,
			formaction: '/bots?/update',
			formdata: PauseBot
		},
		{
			title: 'Delete Bot',
			classes: '!border-red/20 hover:!bg-red',
			icon: Minus,
			menu: DeleteBot
		},
		{
			title: 'Bot Options',
			icon: AdjustmentsHorizontal,
			menu: BotOptions
		}
	];

	const dialogs = [];
</script>

<section
	class="{$selectedAccount ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-40'}
	bg-section-200 flex flex-wrap items-center justify-center transition-[opacity] duration-300"
>
	{#each buttons as data, i}
		{#if (data.admin && $user.admin) || !data.admin}
			{#if data.formaction}
				<form action={data.formaction} method="post" use:enhance>
					{#if data.formdata}
						<div class="hidden"><svelte:component this={data.formdata} /></div>
					{/if}
					<button
						class="square {data.classes ?? ''}"
						title={data.title}
						on:click={() => data.menu && (dialogs[i] = true)}
					>
						<svelte:component this={data.icon} class="icon" />
					</button>
				</form>
			{:else}
				<button
					class="square {data.classes ?? ''}"
					title={data.title}
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
		{/if}
	{/each}
</section>
