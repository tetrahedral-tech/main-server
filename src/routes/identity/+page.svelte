<script>
	import Button from './Button.svelte';
</script>

<main class="w-screen h-screen flex justify-center items-center">
	<section class="flex flex-col w-2/3 md:w-1/3 h-4/5">
		<h1 class="text-2xl">login!</h1>
		<div class="flex justify-center items-center flex-col h-full gap-2 flex-grow">
			<Button provider="google" />
			<Button provider="discord" />
		</div>
	</section>
</main>
