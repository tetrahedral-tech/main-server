<script>
	import GoogleButton from './google/GoogleButton.svelte';
	import DiscordButton from './discord/DiscordButton.svelte';
	import Blob from '../../lib/blob.svelte'
</script>

<main class="w-screen h-screen flex justify-center items-center">
	<Blob/>
	<div class="flex flex-col w-1/5 h-4/5 bg-gray-950/80 border-gray-700 border overflow-hidden border-solid rounded-md">
		<div class="p-6 bg-gray-900">
			<h1 class="text-xl">login!</h1>
		</div>
		<div class="flex justify-center items-center flex-col h-full gap-2 flex-grow">
			<!-- <GoogleButton/> -->
			<!-- <DiscordButton/> -->
		</div>
	</div>
</main>
