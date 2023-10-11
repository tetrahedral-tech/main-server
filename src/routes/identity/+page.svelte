<script>
	import Button from './Button.svelte';
	import { User } from 'svelte-heros-v2';

	export let data;
</script>

<main class="w-screen h-screen flex justify-center items-center flex-col gap-2">
	<section class="flex flex-col w-2/3 md:w-1/3 {data.admin ? 'h-3/5' : 'h-4/5'}">
		<h1 class="text-2xl">login</h1>
		<div class="flex justify-center items-center flex-col h-full gap-2 flex-grow">
			<Button provider="google" />
			<Button provider="discord" />
		</div>
	</section>

	{#if data.admin}
		<section class="w-2/3 md:w-1/3">
			<form class="relative bottom-0 flex flex-col gap-2" action="/identity?/force" method="post">
				<input autocomplete="off" type="text" placeholder="ID" name="id" />
				<button>Force Login</button>
			</form>
		</section>
	{/if}
</main>
