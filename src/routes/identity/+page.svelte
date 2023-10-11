<script>
	import Button from './Button.svelte';

	export let data;
</script>

<main class="flex flex-col items-center justify-center">
	<section class="flex w-2/3 flex-col md:w-1/3 {data.admin ? 'h-3/5' : 'h-4/5'}">
		<h1 class="text-2xl">login</h1>
		<div class="flex h-full flex-grow flex-col items-center justify-center gap-2">
			<Button provider="google" />
			<Button provider="discord" />
		</div>
	</section>

	{#if data.admin}
		<section class="w-2/3 md:w-1/3">
			<form class="flex flex-col gap-2" action="/identity?/force" method="post">
				<input autocomplete="off" type="text" placeholder="ID" name="id" />
				<button>Force Login</button>
			</form>
		</section>
	{/if}
</main>
